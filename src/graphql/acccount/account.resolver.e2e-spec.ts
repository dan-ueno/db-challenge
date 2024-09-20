import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { AccountDatasourceService } from 'shared/data';
import { PrismaService } from '@core/database';
import { AppModule } from '.././../app.module';

describe.only('Account Resolver (e2e)', () => {
  let app: INestApplication;
  let accountDatasource: AccountDatasourceService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    accountDatasource = moduleFixture.get<AccountDatasourceService>(
      AccountDatasourceService,
    );
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await prismaService.account.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return BaseAccountModel', async () => {
    const account = await accountDatasource.create(
      'test User',
      'test@email.com',
    );

    const response = await request(app.getHttpServer()).query(getAccountQuery, {
      data: { id: account.id },
    });

    expect(response.response.statusCode).toBe(200);
    expect(response.data).not.toBe({
      getAccount: account,
    });
  });
});

const getAccountQuery = gql`
  query getAccount($data: AccountByIdInput!) {
    getAccount(data: $data) {
      id
      name
      email
    }
  }
`;
