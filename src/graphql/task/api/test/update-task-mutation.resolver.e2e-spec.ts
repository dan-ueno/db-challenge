import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UpdateTaskInput } from '../task.input';
import {
  AccountModel,
  AgentModel,
  ScheduleBaseModel,
  TASK_NOT_FOUND_MESSAGE,
  TaskBaseModel,
  TaskType,
} from 'shared';
import { addDays } from 'date-fns';
import { UNAUTHORIZED_TASK_MESSAGE } from '../task.resolver';
import { ACCOUNT_UNAUTHORIZED_MESSAGE } from '../../service/use-case';

describe('Task Resolver - update mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let variables: { data: UpdateTaskInput };
  let account: AccountModel;
  let agent: AgentModel;
  let schedule: ScheduleBaseModel;
  let task: TaskBaseModel;
  const updateTaskMutation = gql`
    mutation updateTask($data: UpdateTaskInput!) {
      updateTask(data: $data) {
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
    task = await prismaService.task.create({
      data: {
        scheduleId: schedule.id,
        accountId: account.id,
        startTime: new Date(),
        duration: 5,
        type: TaskType.break,
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

  it('Should update and return BaseTask', async () => {
    variables = {
      data: { id: task.id, startTime: addDays(new Date(), 5), duration: 2 },
    };

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id}`)
      .mutate(updateTaskMutation, variables);
    const updatedTask = await prismaService.task.findFirstOrThrow({});

    expect(response.data.updateTask).toBeDefined();
    expect(task.startTime).not.toBe(updatedTask.startTime);
    expect(task.duration).not.toBe(updatedTask.duration);
    expect(response.data.updateTask.id).toEqual(updatedTask.id);
  });

  it('Should fail if taskId does not match any Task', async () => {
    variables = { data: { id: 'task.id' } };

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id}`)
      .mutate(updateTaskMutation, variables);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(TASK_NOT_FOUND_MESSAGE);
  });

  it('Should fail if accountId is not at headers', async () => {
    variables = { data: { id: task.id } };

    const response = await request(app.getHttpServer()).mutate(
      updateTaskMutation,
      variables,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_TASK_MESSAGE);
  });

  it('Should fail if accountId at headers is not from the task', async () => {
    const otherAccount = await prismaService.account.create({
      data: {
        email: 'email@email.com',
        name: 'another account',
      },
    });
    variables = {
      data: { id: task.id, startTime: addDays(new Date(), 5), duration: 2 },
    };

    const response = await request(app.getHttpServer())
      .set('accountId', `${otherAccount.id}`)
      .mutate(updateTaskMutation, variables);

    expect(response.errors[0].message).toBe(ACCOUNT_UNAUTHORIZED_MESSAGE);
  });
});
