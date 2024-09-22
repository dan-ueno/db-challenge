import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { UpdateAgentInput } from '../agent.input';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AgentDatasourceService, NOT_FOUND_AGENT_MESSAGE } from 'shared/data';
import { UNAUTHORIZED_AGENT_MESSAGE } from '../agent.resolver';

describe('Agent Resolver - updateAgent mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let agentDatasource: AgentDatasourceService;
  let variables: { data: UpdateAgentInput };
  const updateAgentMutation = gql`
    mutation updateAgent($data: UpdateAgentInput!) {
      updateAgent(data: $data) {
        id
        name
        email
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

  it('Should update the agent and return BaseAgentModel', async () => {
    const agent = await agentDatasource.create('test User', 'test@email.com');
    expect(agent).toBeDefined();
    variables = { data: { name: 'updated test User' } };

    const response = await request(app.getHttpServer())
      .set('AgentId', `${agent.id}`)
      .mutate(updateAgentMutation, variables);
    const updatedUser = await agentDatasource.findById(agent.id);

    expect(response.data).toStrictEqual({
      updateAgent: updatedUser,
    });
    expect(updatedUser.name).toBe(variables.data.name);
  });

  it('Should fail if AgentId does not match any Agent', async () => {
    const agent = await agentDatasource.create('test User', 'test@email.com');
    expect(agent).toBeDefined();
    variables = { data: { name: 'updated test User' } };

    const response = await request(app.getHttpServer())
      .set('agentId', `${agent.id + 1}`)
      .mutate(updateAgentMutation, variables);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(NOT_FOUND_AGENT_MESSAGE);
  });

  it('Should fail if AgentId is not at headers', async () => {
    variables = { data: { name: 'updated test User' } };

    const response = await request(app.getHttpServer()).mutate(
      updateAgentMutation,
      variables,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_AGENT_MESSAGE);
  });

  it('Should fail if AgentId at headers is not a number', async () => {
    variables = { data: { name: 'updated test User' } };

    const response = await request(app.getHttpServer())
      .set('agentId', 'string')
      .mutate(updateAgentMutation, variables);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_AGENT_MESSAGE);
  });
});
