import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoopWorkerService, WorkerName } from '../application/loop-worker.service';

@ApiTags('workers')
@Controller('workers')
export class WorkerController {
  constructor(private readonly loopWorker: LoopWorkerService) {}

  @Get()
  @ApiOperation({ summary: 'List active loop workers' })
  status() {
    return this.loopWorker.getStatus();
  }

  @Get('trigger/:name')
  @ApiOperation({ summary: 'Trigger a worker run on demand' })
  async trigger(@Param('name') name: WorkerName) {
    await this.loopWorker.run(name);
    return { triggered: name, ok: true };
  }
}
