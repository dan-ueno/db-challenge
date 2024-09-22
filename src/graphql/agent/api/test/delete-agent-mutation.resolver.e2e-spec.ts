import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AgentDatasourceService, NOT_FOUND_AGENT_MESSAGE } from 'shared/data';
import {
  DELETED_AGENT_MESSAGE,
  UNAUTHORIZED_AGENT_MESSAGE,
} from '../agent.resolver';

describe('Agent Resolver - delete mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let agentDatasource: AgentDatasourceService;
  const deleteAgentMutation = gql`
    mutation deleteAgent {
      deleteAgent
    }
  `;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    app = moduleFixture.createNestApplication();
    await app.init();
    agentDatasource = moduleFixture.get<AgentDatasourceService>(
      AgentDatasourceService,
    );
  });

  afterEach(async () => {
    await prismaService.agent.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('Should delete the agent and return confirmation string', async () => {
    const agent = await agentDatasource.create('test User', 'test@email.com');
    expect(agent).toBeDefined();

    const response = await request(app.getHttpServer())
      .set('agentId', `${agent.id}`)
      .mutate(deleteAgentMutation);

    expect(response.data.deleteAgent).toBe(DELETED_AGENT_MESSAGE);
  });

  it('Should fail if AgentId does not match any Agent', async () => {
    const agent = await agentDatasource.create('test User', 'test@email.com');
    expect(agent).toBeDefined();

    const response = await request(app.getHttpServer())
      .set('AgentId', `${agent.id + 9999}`)
      .mutate(deleteAgentMutation);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(NOT_FOUND_AGENT_MESSAGE);
  });

  it('Should fail if AgentId is not at headers', async () => {
    const response = await request(app.getHttpServer()).mutate(
      deleteAgentMutation,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_AGENT_MESSAGE);
  });

  it('Should fail if AgentId at headers is not a number', async () => {
    const response = await request(app.getHttpServer())
      .set('AgentId', 'string')
      .mutate(deleteAgentMutation);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_AGENT_MESSAGE);
  });
});
