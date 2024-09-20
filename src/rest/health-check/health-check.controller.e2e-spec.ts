import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { HealthCheckModule } from './health-check.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testAgent: TestAgent;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthCheckModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    testAgent = request(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return OK to verify if container is healthy', async () => {
    const response = await testAgent.get('/health-check');

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('OK');
  });
});
