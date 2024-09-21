import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { AccountDatasourceService } from 'shared/data';
import { AccountByEmailInput } from '../account.input';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('Account Resolver - getAccount query', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accountDatasource: AccountDatasourceService;
  let queryVariables: { data: AccountByEmailInput };
  const getAccountQuery = gql`
    query getAccount($data: AccountByEmailInput!) {
      getAccount(data: $data) {
        id
        name
        email
      }
    }
  `;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    app = moduleFixture.createNestApplication();
    await app.init();
    accountDatasource = moduleFixture.get<AccountDatasourceService>(
      AccountDatasourceService,
    );
    await prismaService.account.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('Should return BaseAccountModel', async () => {
    const account = await accountDatasource.create(
      'test User',
      'test@email.com',
    );
    queryVariables = { data: { email: account.email } };

    const response = await request(app.getHttpServer()).query(
      getAccountQuery,
      queryVariables,
    );

    expect(response.data).toStrictEqual({
      getAccount: account,
    });
  });

  it('Should fail if email is not registered', async () => {
    queryVariables = { data: { email: 'non-existent@email.com' } };

    const response = await request(app.getHttpServer()).query(
      getAccountQuery,
      queryVariables,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe('No Account found');
  });
});
