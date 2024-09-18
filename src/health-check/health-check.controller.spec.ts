import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './health-check.controller';
import { AppService } from './health-check.service';

describe('HealthCheckController', () => {
  let controller: HealthCheckController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [AppService],
    }).compile();

    controller = app.get<HealthCheckController>(HealthCheckController);
  });

  it('should return "OK"', () => {
    expect(controller.healthCheck()).toBe('OK');
  });
});
