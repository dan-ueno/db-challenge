import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { CreateAgentInput } from '../agent.input';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AgentDatasourceService, CONFLICT_AGENT_MESSAGE } from 'shared/data';

describe('Agent Resolver - createAgent mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let agentDatasource: AgentDatasourceService;
  let variables: { data: CreateAgentInput };
  const createAgentMutation = gql`
    mutation createAgent($data: CreateAgentInput!) {
      createAgent(data: $data) {
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

  it('Should create the user and return BaseAgentModel', async () => {
    await agentDatasource.create('test User', 'test@email.com');
    variables = {
      data: { name: 'test User 2', email: 'test2@email.com' },
    };

    const response = await request(app.getHttpServer()).mutate(
      createAgentMutation,
      variables,
    );
    const newUser = await agentDatasource.findByEmail(variables.data.email);

    expect(response.data).toStrictEqual({
      createAgent: newUser,
    });
    expect(newUser.name).toBe(variables.data.name);
  });

  it('Should fail if email is already registered', async () => {
    const agent = await agentDatasource.create('test User', 'test@email.com');
    variables = { data: { name: 'test User 2', email: agent.email } };

    const response = await request(app.getHttpServer()).mutate(
      createAgentMutation,
      variables,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(CONFLICT_AGENT_MESSAGE);
  });
});
