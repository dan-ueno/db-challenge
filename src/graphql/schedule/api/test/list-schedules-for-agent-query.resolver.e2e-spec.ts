import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AccountModel, AgentModel, TaskType } from 'shared';
import { addDays, subDays } from 'date-fns';
import { ScheduleBase } from '../schedule.type';
import { UNAUTHORIZED_AGENT_MESSAGE } from '../schedule.resolver';

describe('Scheduler Resolver - listSchedulesforAccount query', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let account: AccountModel;
  let agent: AgentModel;
  let schedules: ScheduleBase[];
  const listSchedulesforAgent = gql`
    query listSchedulesforAgent {
      listSchedulesforAgent {
        id
        accountId
        agentId
        startTime
        endTime
        tasks {
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
    await prismaService.schedule.createMany({
      data: [
        {
          accountId: account.id,
          agentId: agent.id,
          startTime: subDays(new Date(), 2),
          endTime: addDays(new Date(), 5),
        },
        {
          accountId: account.id,
          agentId: agent.id,
          startTime: subDays(new Date(), 1),
          endTime: addDays(new Date(), 5),
        },
      ],
    });
    schedules = await prismaService.schedule.findMany({});
    await prismaService.task.createMany({
      data: [
        {
          scheduleId: schedules[0].id,
          accountId: account.id,
          startTime: new Date(),
          duration: 1,
          type: TaskType.work,
        },
        {
          scheduleId: schedules[0].id,
          accountId: account.id,
          startTime: new Date(),
          duration: 2,
          type: TaskType.break,
        },
        {
          scheduleId: schedules[1].id,
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

  it('Should  list schedules', async () => {
    const response = await request(app.getHttpServer())
      .set('agentId', `${agent.id}`)
      .mutate(listSchedulesforAgent);
    const dbTasks = await prismaService.schedule.findMany({});
    const responseSchedules = response.data?.listSchedulesforAgent;

    expect(responseSchedules.length).toBe(2);
    expect(responseSchedules[0].id).toBe(dbTasks[0].id);
    expect(responseSchedules[0].tasks.length).toBe(2);
    expect(responseSchedules[1].id).toBe(dbTasks[1].id);
    expect(responseSchedules[1].tasks.length).toBe(1);
  });

  it('Should  list 1 account schedule, fist schedule after ending period', async () => {
    await prismaService.schedule.update({
      where: { id: schedules[0].id },
      data: {
        startTime: subDays(new Date(), 2),
        endTime: subDays(new Date(), 1),
      },
    });
    const response = await request(app.getHttpServer())
      .set('agentId', `${agent.id}`)
      .mutate(listSchedulesforAgent);
    const responseSchedule = response.data.listSchedulesforAgent;

    expect(responseSchedule.length).toBe(1);
    expect(responseSchedule[0].id).toBe(schedules[1].id);
  });

  it('Should fail if there is no agentId at headers', async () => {
    const response = await request(app.getHttpServer()).mutate(
      listSchedulesforAgent,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_AGENT_MESSAGE);
  });
});
