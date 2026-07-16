import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../../../shared/database/prisma.service';
import { AppLogger } from '../../../shared/logger/app.logger';
import { WorkerIntervals, DEFAULT_WORKER_INTERVALS } from '../domain/worker.types';

export type WorkerName = 'audit' | 'optimize' | 'consolidate';

@Injectable()
export class LoopWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly auditLogger = new AppLogger();
  private readonly registered = new Set<WorkerName>();
  private running = new Map<WorkerName, boolean>();
  private readonly intervals: WorkerIntervals;

  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.intervals = {
      audit: Number(process.env.WORKER_AUDIT_INTERVAL ?? DEFAULT_WORKER_INTERVALS.audit),
      optimize: Number(process.env.WORKER_OPTIMIZE_INTERVAL ?? DEFAULT_WORKER_INTERVALS.optimize),
      consolidate: Number(process.env.WORKER_CONSOLIDATE_INTERVAL ?? DEFAULT_WORKER_INTERVALS.consolidate),
    };
  }

  onModuleInit(): void {
    this.registerInterval('audit', this.intervals.audit);
    this.registerInterval('optimize', this.intervals.optimize);
    this.registerInterval('consolidate', this.intervals.consolidate);
    this.auditLogger.log('Loop workers scheduled', 'LoopWorkerService');
  }

  onModuleDestroy(): void {
    for (const name of this.registered) {
      try {
        this.schedulerRegistry.deleteInterval(`loop-${name}`);
      } catch {
        /* already removed */
      }
    }
  }

  private registerInterval(name: WorkerName, seconds: number): void {
    const ref = setInterval(() => {
      void this.run(name);
    }, seconds * 1000);
    this.schedulerRegistry.addInterval(`loop-${name}`, ref);
    this.registered.add(name);
  }

  async run(name: WorkerName): Promise<void> {
    if (this.running.get(name)) {
      this.auditLogger.warn(`Worker ${name} still running; skip overlap`);
      return;
    }
    this.running.set(name, true);
    const startedAt = Date.now();
    try {
      let itemsProcessed = 0;
      switch (name) {
        case 'audit':
          itemsProcessed = await this.audit();
          break;
        case 'optimize':
          itemsProcessed = await this.optimize();
          break;
        case 'consolidate':
          itemsProcessed = await this.consolidate();
          break;
      }
      await this.persistRun(name, 'SUCCESS', itemsProcessed, null, startedAt);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.persistRun(name, 'ERROR', 0, message, startedAt);
      this.auditLogger.error(`Worker ${name} failed`, 'LoopWorkerService', err);
    } finally {
      this.running.set(name, false);
    }
  }

  private async audit(): Promise<number> {
    const stale = await this.prisma.systemConfig.findMany({
      where: { updatedAt: { lt: new Date(Date.now() - 86_400_000) } },
    });
    if (stale.length > 0) {
      this.auditLogger.warn(`Found ${stale.length} stale config rows`, 'LoopWorkerService');
    }
    return stale.length;
  }

  private async optimize(): Promise<number> {
    const configs = await this.prisma.systemConfig.count();
    const runs = await this.prisma.workerRun.count();
    return configs + runs;
  }

  private async consolidate(): Promise<number> {
    const old = await this.prisma.workerRun.deleteMany({
      where: { startedAt: { lt: new Date(Date.now() - 30 * 86_400_000) } },
    });
    return old.count;
  }

  private async persistRun(
    name: WorkerName,
    status: 'SUCCESS' | 'ERROR' | 'SKIPPED',
    itemsProcessed: number,
    message: string | null,
    startedAt: number,
  ): Promise<void> {
    await this.prisma.workerRun.create({
      data: {
        workerName: name,
        status,
        itemsProcessed,
        message,
        durationMs: Date.now() - startedAt,
        finishedAt: new Date(),
      },
    });
  }

  getStatus(): { active: WorkerName[]; running: WorkerName[] } {
    return {
      active: [...this.registered],
      running: [...this.running.entries()]
        .filter(([, v]) => v)
        .map(([k]) => k),
    };
  }
}
