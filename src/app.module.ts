import { Module } from '@nestjs/common';
import { HealthCheckModule } from './health-check';
import { CoreModule } from '@core/core.module';

@Module({
  imports: [CoreModule, HealthCheckModule],
})
export class AppModule {}
