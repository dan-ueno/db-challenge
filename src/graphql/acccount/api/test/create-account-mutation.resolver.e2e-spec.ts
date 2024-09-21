import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { CreateAccountInput } from '../account.input';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@core/database';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AccountDatasourceService } from 'src/shared';

describe.only('Account Resolver - createAccount mutation', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accountDatasource: AccountDatasourceService;
  let variables: { data: CreateAccountInput };
  const createAccountMutation = gql`
    mutation createAccount($data: CreateAccountInput!) {
      createAccount(data: $data) {
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

  it('Should create the user and return BaseAccountModel', async () => {
    await accountDatasource.create('test User', 'test@email.com');
    variables = {
      data: { name: 'test User 2', email: 'test2@email.com' },
    };

    const response = await request(app.getHttpServer()).mutate(
      createAccountMutation,
      variables,
    );
    const newUser = await accountDatasource.findByEmail(variables.data.email);

    expect(response.data).toStrictEqual({
      createAccount: newUser,
    });
    expect(newUser.name).toBe(variables.data.name);
  });

  it('Should fail if email is already registered', async () => {
    const account = await accountDatasource.create(
      'test User',
      'test@email.com',
    );
    variables = { data: { name: 'test User 2', email: account.email } };

    const response = await request(app.getHttpServer()).mutate(
      createAccountMutation,
      variables,
    );
    console.log(response.errors[0].message);
    expect(response.data).toBeNull();
    // expect(response.errors[0].message).toBe('Email already registered');
  });
});
