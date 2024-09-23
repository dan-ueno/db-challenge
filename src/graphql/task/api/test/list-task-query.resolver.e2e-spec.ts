import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AccountModel, TaskType } from 'shared';
import { addDays, subDays } from 'date-fns';
import { UNAUTHORIZED_TASK_MESSAGE } from '../task.resolver';

describe('Task Resolver - listTasks query', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let account: AccountModel;
  const listTaskQuery = gql`
    query listTasks {
      listTasks {
        id
        scheduleId
        accountId
        duration
        startTime
        type
        account {
          name
          email
        }
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
    const agent = await prismaService.agent.create({
      data: { name: 'Agent User', email: 'agent@email.com' },
    });
    const schedule = await prismaService.schedule.create({
      data: {
        accountId: account.id,
        agentId: agent.id,
        startTime: subDays(new Date(), 2),
        endTime: addDays(new Date(), 5),
      },
    });
    await prismaService.task.createMany({
      data: [
        {
          scheduleId: schedule.id,
          accountId: account.id,
          startTime: new Date(),
          duration: 1,
          type: TaskType.work,
        },
        {
          scheduleId: schedule.id,
          accountId: account.id,
          startTime: new Date(),
          duration: 2,
          type: TaskType.break,
        },
      ],
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

  it('Should  list account tasks', async () => {
    const response = await request(app.getHttpServer())
      .set('accountid', `${account.id}`)
      .mutate(listTaskQuery);
    const dbTasks = (await prismaService.task.findMany({})).sort(
      (a, b) => a.duration - b.duration,
    );
    const responseTasks = response.data.listTasks.sort(
      (a: any, b: any) => a.duration - b.duration,
    );
    expect(response.data.listTasks.length).toBe(2);
    expect(responseTasks[0].id).toBe(dbTasks[0].id);
    expect(responseTasks[1].id).toBe(dbTasks[1].id);
  });

  it('Should  list 1 account task, fist task after ending period', async () => {
    const tasks = await prismaService.task.findMany({});
    await prismaService.task.update({
      where: { id: tasks[0].id },
      data: { duration: 1, startTime: subDays(new Date(), 2) },
    });
    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id}`)
      .mutate(listTaskQuery);
    const dbTasks = (await prismaService.task.findMany({})).sort(
      (a, b) => a.duration - b.duration,
    );
    const responseTasks = response.data.listTasks.sort(
      (a: any, b: any) => a.duration - b.duration,
    );

    expect(response.data.listTasks.length).toBe(1);
    expect(responseTasks[0].id).toBe(dbTasks[1].id);
  });

  it('Should fail if there is no accountId at headers', async () => {
    const response = await request(app.getHttpServer()).mutate(listTaskQuery);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_TASK_MESSAGE);
  });
});
