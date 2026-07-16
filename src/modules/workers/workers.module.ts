import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoopWorkerService } from './application/loop-worker.service';
import { WorkerController } from './interfaces/worker.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [WorkerController],
  providers: [LoopWorkerService],
  exports: [LoopWorkerService],
})
export class WorkersModule {}
