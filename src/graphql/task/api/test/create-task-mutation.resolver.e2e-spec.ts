import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  AccountModel,
  AgentModel,
  ScheduleBaseModel,
  TaskType,
} from 'src/shared';
import { CreateTaskInput } from '../task.input';
import { addDays } from 'date-fns';
import { UNAUTHORIZED_TASK_MESSAGE } from '../task.resolver';

describe('Task Resolver - createTask mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let variables: { data: CreateTaskInput };
  let account: AccountModel;
  let agent: AgentModel;
  let schedule: ScheduleBaseModel;
  const createTaskMutation = gql`
    mutation createTask($data: CreateTaskInput!) {
      createTask(data: $data) {
        id
        scheduleId
        accountId
        duration
        startTime
        type
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
    schedule = await prismaService.schedule.create({
      data: {
        accountId: account.id,
        agentId: agent.id,
        startTime: new Date(),
        endTime: addDays(new Date(), 5),
      },
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

  it('Should create the task and return BaseTaskModel', async () => {
    variables = {
      data: {
        scheduleId: schedule.id,
        startTime: new Date().toISOString(),
        duration: 5,
        type: TaskType.work,
      },
    };

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id}`)
      .mutate(createTaskMutation, variables);
    const createdTask = await prismaService.task.findFirstOrThrow({});
    const { startTime, ...data } = response.data.createTask;
    const { startTime: dbStartTime, ...dbData } = createdTask;

    expect(data).toStrictEqual(dbData);
    expect(new Date(startTime).toISOString()).toBe(dbStartTime.toISOString());
  });

  it('Should fail if accountId is not at headers', async () => {
    variables = {
      data: {
        startTime: new Date().toISOString(),
        duration: 5,
        scheduleId: schedule.id,
        type: TaskType.work,
      },
    };

    const response = await request(app.getHttpServer()).mutate(
      createTaskMutation,
      variables,
    );
    const createdTask = await prismaService.task.findFirst({});

    expect(response.data).toBeNull();
    expect(createdTask).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_TASK_MESSAGE);
  });

  it('Should fail if scheduleId does not exist', async () => {
    variables = {
      data: {
        startTime: new Date().toISOString(),
        duration: 5,
        scheduleId: 'schedule.id',
        type: TaskType.work,
      },
    };

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id}`)
      .mutate(createTaskMutation, variables);
    const createdTask = await prismaService.task.findFirst({});

    expect(response.data).toBeNull();
    expect(createdTask).toBeNull();
    expect(response.errors[0].message).toBeDefined();
  });
});
