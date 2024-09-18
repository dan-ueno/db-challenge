import { Controller, Get } from '@nestjs/common';
import { AppService } from './health-check.service';

@Controller('/health-check')
export class HealthCheckController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
