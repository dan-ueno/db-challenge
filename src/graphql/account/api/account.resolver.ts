import {
  AccountByEmailInput,
  UpdateAccountInput,
  CreateAccountInput,
} from './account.input';
import { AccountService } from '../service/account.service';
import { Account } from './account.type';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { AccountModel } from 'shared/model';

export const DELETED_ACCOUNT_MESSAGE = 'Account successsfully deleted';
export const UNAUTHORIZED_ACCOUNT_MESSAGE = 'accountId must be informed';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => Account)
  async getAccount(
    @Args('data') input: AccountByEmailInput,
  ): Promise<AccountModel> {
    return this.accountService.findByEmail(input.email);
  }

  @Mutation(() => Account)
  async createAccount(
    @Args('data') input: CreateAccountInput,
  ): Promise<AccountModel> {
    return this.accountService.create(input.name, input.email);
  }

  @Mutation(() => Account)
  async updateAccount(
    @Context('accountid') accountId: string,
    @Args('data') input: UpdateAccountInput,
  ): Promise<AccountModel> {
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
