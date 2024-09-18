import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';
import { AppService } from './health-check.service';

@Module({
  controllers: [HealthCheckController],
  providers: [AppService],
})
export class HealthCheckModule {}
