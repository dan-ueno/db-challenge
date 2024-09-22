import {
  AccountByEmailInput,
  UpdateAccountInput,
  CreateAccountInput,
} from './account.input';
import { AccountService } from '../service/account.service';
import { AccountBase } from './account.type';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { AccountBaseModel } from 'shared/model';

export const DELETED_ACCOUNT_MESSAGE = 'Account successsfully deleted';
export const UNAUTHORIZED_ACCOUNT_MESSAGE = 'accountId must be informed';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => AccountBase)
  async getAccount(
    @Args('data') input: AccountByEmailInput,
  ): Promise<AccountBaseModel> {
    return this.accountService.findByEmail(input.email);
  }

  @Mutation(() => AccountBase)
  async createAccount(
    @Args('data') input: CreateAccountInput,
  ): Promise<AccountBaseModel> {
    return this.accountService.create(input.name, input.email);
  }

  @Mutation(() => AccountBase)
  async updateAccount(
    @Context('accountid') accountId: string,
    @Args('data') input: UpdateAccountInput,
  ): Promise<AccountBaseModel> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_ACCOUNT_MESSAGE);
    }
    return this.accountService.update(+accountId, input.name);
  }

  @Mutation(() => String)
  async deleteAccount(
    @Context('accountid') accountId: string,
  ): Promise<string> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_ACCOUNT_MESSAGE);
    }
    await this.accountService.delete(+accountId);
    return DELETED_ACCOUNT_MESSAGE;
  }
}
