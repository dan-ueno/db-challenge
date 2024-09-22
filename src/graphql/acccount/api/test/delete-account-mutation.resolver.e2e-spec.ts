import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  AccountDatasourceService,
  NOT_FOUND_ACCOUNT_MESSAGE,
} from 'shared/data';
import {
  DELETED_ACCOUNT_MESSAGE,
  UNAUTHORIZED_ACCOUNT_MESSAGE,
} from '../account.resolver';

describe('Account Resolver - delete mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accountDatasource: AccountDatasourceService;
  const deleteAccountMutation = gql`
    mutation deleteAccount {
      deleteAccount
    }
  `;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    app = moduleFixture.createNestApplication();
    await app.init();
    accountDatasource = moduleFixture.get<AccountDatasourceService>(
      AccountDatasourceService,
    );
  });

  afterEach(async () => {
    await prismaService.account.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('Should delete the account and return confirmation string', async () => {
    const account = await accountDatasource.create(
      'test User',
      'test@email.com',
    );
    expect(account).toBeDefined();

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id}`)
      .mutate(deleteAccountMutation);

    expect(response.data.deleteAccount).toBe(DELETED_ACCOUNT_MESSAGE);
  });

  it('Should fail if accountId does not match any account', async () => {
    const account = await accountDatasource.create(
      'test User',
      'test@email.com',
    );

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id + 9999}`)
      .mutate(deleteAccountMutation);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(NOT_FOUND_ACCOUNT_MESSAGE);
  });

  it('Should fail if accountId is not at headers', async () => {
    const response = await request(app.getHttpServer()).mutate(
      deleteAccountMutation,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_ACCOUNT_MESSAGE);
  });

  it('Should fail if accountId at headers is not a number', async () => {
    const response = await request(app.getHttpServer())
      .set('accountId', 'string')
      .mutate(deleteAccountMutation);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_ACCOUNT_MESSAGE);
  });
});
