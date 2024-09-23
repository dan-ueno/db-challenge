import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AccountModel, AgentModel } from 'shared';
import { UNAUTHORIZED_ACCOUNT_MESSAGE } from '../schedule.resolver';
import { CreateScheduleInput } from '../schedule.input';

describe('Scheduler Resolver - createSchedule mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let account: AccountModel;
  let agent: AgentModel;
  let variables: { data: CreateScheduleInput };
  const createSchedule = gql`
    mutation createSchedule($data: CreateScheduleInput!) {
      createSchedule(data: $data) {
        id
        accountId
        agentId
        startTime
        endTime
      }
    }
  `;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    account = await prismaService.account.create({
      data: { name: 'Account User', email: 'account@email.com' },
    });
    agent = await prismaService.agent.create({
      data: { name: 'Agent User', email: 'agent@email.com' },
    });
  });

  afterEach(async () => {
    await prismaService.task.deleteMany({});
    await prismaService.schedule.deleteMany({});
    await prismaService.account.deleteMany({});
    await prismaService.agent.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('Should  create schedule', async () => {
    variables = {
      data: {
        agentId: agent.id,
        startTime: new Date(),
        endTime: new Date(),
      },
    };

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id}`)
      .mutate(createSchedule, variables);
    const dbSchedule = await prismaService.schedule.findFirstOrThrow({});
    const responseSchedule = response.data?.createSchedule;

    expect(responseSchedule).toBeDefined();
    expect(responseSchedule.id).toBe(dbSchedule.id);
    expect(variables.data.agentId).toBe(dbSchedule.agentId);
  });

  it('Should fail if there is no accountId at headers', async () => {
    variables = {
      data: {
        agentId: agent.id,
        startTime: new Date(),
        endTime: new Date(),
      },
    };

    const response = await request(app.getHttpServer()).mutate(
      createSchedule,
      variables,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_ACCOUNT_MESSAGE);
  });
});
