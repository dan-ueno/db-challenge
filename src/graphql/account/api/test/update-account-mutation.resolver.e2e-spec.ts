import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { UpdateAccountInput } from '../account.input';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import {
  AccountDatasourceService,
  NOT_FOUND_ACCOUNT_MESSAGE,
} from 'shared/data';
import { UNAUTHORIZED_ACCOUNT_MESSAGE } from '../account.resolver';

describe('Account Resolver - updateAccount mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accountDatasource: AccountDatasourceService;
  let variables: { data: UpdateAccountInput };
  const updateAccountMutation = gql`
    mutation updateAccount($data: UpdateAccountInput!) {
      updateAccount(data: $data) {
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

  it('Should update the user and return BaseAccountModel', async () => {
    const account = await accountDatasource.create(
      'test User',
      'test@email.com',
    );
    variables = { data: { name: 'updated test User' } };
    expect(account).toBeDefined();

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id}`)
      .mutate(updateAccountMutation, variables);
    const updatedUser = await accountDatasource.findById(account.id);

    expect(response.data).toStrictEqual({
      updateAccount: updatedUser,
    });
    expect(updatedUser.name).toBe(variables.data.name);
  });

  it('Should fail if accountId does not match any account', async () => {
    const account = await accountDatasource.create(
      'test User',
      'test@email.com',
    );
    variables = { data: { name: 'updated test User' } };

    const response = await request(app.getHttpServer())
      .set('accountId', `${account.id + 1}`)
      .mutate(updateAccountMutation, variables);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(NOT_FOUND_ACCOUNT_MESSAGE);
  });

  it('Should fail if accountId is not at headers', async () => {
    variables = { data: { name: 'updated test User' } };

    const response = await request(app.getHttpServer()).mutate(
      updateAccountMutation,
      variables,
    );

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_ACCOUNT_MESSAGE);
  });

  it('Should fail if accountId at headers is not a number', async () => {
    variables = { data: { name: 'updated test User' } };

    const response = await request(app.getHttpServer())
      .set('accountId', 'string')
      .mutate(updateAccountMutation, variables);

    expect(response.data).toBeNull();
    expect(response.errors[0].message).toBe(UNAUTHORIZED_ACCOUNT_MESSAGE);
  });
});
