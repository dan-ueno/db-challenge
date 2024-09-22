import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { AgentDatasourceService, NOT_FOUND_AGENT_MESSAGE } from 'shared/data';
import { AgentByEmailInput } from '../agent.input';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('Agent Resolver - getAgent query', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let agentDatasource: AgentDatasourceService;
  let queryVariables: { data: AgentByEmailInput };
  const getAgentQuery = gql`
    query getAgent($data: AgentByEmailInput!) {
      getAgent(data: $data) {
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

  it('Should return BaseAgentModel', async () => {
    const agent = await agentDatasource.create('test User', 'test@email.com');
    queryVariables = { data: { email: agent.email } };

    const response = await request(app.getHttpServer()).query(
      getAgentQuery,
      queryVariables,
    );

    expect(response.data).toStrictEqual({
      getAgent: agent,
    });
  });

  it('Should fail if email is not registered', async () => {
    queryVariables = { data: { email: 'non-existent@email.com' } };

    const response = await request(app.getHttpServer()).query(
      getAgentQuery,
      queryVariables,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(NOT_FOUND_AGENT_MESSAGE);
  });
});
