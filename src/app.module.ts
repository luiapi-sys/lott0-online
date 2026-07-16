import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../shared/database/database.module';
import { LoggerModule } from '../shared/logger/logger.module';
import { HealthModule } from '../shared/health/health.module';
import { WorkersModule } from '../modules/workers/workers.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    LoggerModule,
    HealthModule,
    WorkersModule,
  ],
})
export class AppModule {}
