import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AccountModel, AgentModel, ScheduleBaseModel } from 'shared';
import {
  UNAUTHORIZED_ACCOUNT_MESSAGE,
  DELETED_SCHEDULE_MESSAGE,
} from '../schedule.resolver';
import { DeleteScheduleInput } from '../schedule.input';
import { addDays, subDays } from 'date-fns';
import { ACCOUNT_UNAUTHORIZED_MESSAGE } from 'src/graphql/task/service/use-case';

describe('Scheduler Resolver - deleteSchedule mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let account: AccountModel;
  let agent: AgentModel;
  let schedule: ScheduleBaseModel;
  let variables: { data: DeleteScheduleInput };
  const deleteScheduleMutation = gql`
    mutation deleteSchedule($data: DeleteScheduleInput!) {
      deleteSchedule(data: $data)
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
        startTime: subDays(new Date(), 2),
        endTime: addDays(new Date(), 5),
      },
    });
  });

  afterEach(async () => {
    await prismaService.schedule.deleteMany({});
    await prismaService.account.deleteMany({});
    await prismaService.agent.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('Should  delete schedule', async () => {
    variables = {
      data: { id: schedule.id },
    };

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id}`)
      .mutate(deleteScheduleMutation, variables);
    const dbSchedule = await prismaService.schedule.findFirst({});
    const responseSchedule = response.data.deleteSchedule;

    expect(responseSchedule).toBeDefined();
    expect(responseSchedule).toBe(DELETED_SCHEDULE_MESSAGE);
    expect(dbSchedule).toBeNull();
  });

  it('Should fail if accountId is different from the schedule', async () => {
    const anotherAccount = await prismaService.account.create({
      data: {
        name: 'another acccount',
        email: 'another-email@email.com',
      },
    });
    variables = {
      data: { id: schedule.id },
    };

    const response = await request(app.getHttpServer())
      .set('accountId', `${anotherAccount.id}`)
      .mutate(deleteScheduleMutation, variables);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(ACCOUNT_UNAUTHORIZED_MESSAGE);
  });

  it('Should fail if there is no accountId at headers', async () => {
    variables = {
      data: { id: schedule.id },
    };

    const response = await request(app.getHttpServer()).mutate(
      deleteScheduleMutation,
      variables,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_ACCOUNT_MESSAGE);
  });
});
