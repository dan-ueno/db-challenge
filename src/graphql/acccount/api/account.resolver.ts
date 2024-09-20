import {
  AccountByEmailInput,
  UpdateAccountInput,
  CreateAccountInput,
} from './account.input';
import { AccountService } from '../service/account.service';
import { AccountBase } from './account.type';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { AccountBaseModel, AccountModel } from 'shared/model';

const DELETED_ACCOUNT_MESSAGE = 'Account successsfully deleted';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => AccountBase)
  async getAccount(
    @Args('data') input: AccountByEmailInput,
  ): Promise<AccountBaseModel> {
    return this.accountService.findByEmail(input.email);
  }

  // @Query(() => Account)
  // async getAccountDetails(
  //   @Headers('accountId') id: number,
  // ): Promise<AccountModel> {
  //   return this.accountService.getAccountDetails(id);
  // }

  @Mutation(() => AccountBase)
  async createAccount(
    @Args('data') input: CreateAccountInput,
  ): Promise<AccountBaseModel> {
    return this.accountService.create(input.name, input.name);
  }

  @Mutation(() => AccountBase)
  async updateAccount(
    @Context('accountid') accountId: string,
    @Args('data') input: UpdateAccountInput,
  ): Promise<AccountBaseModel> {
    if (!Number(accountId)) {
      throw new UnauthorizedException('accountId must be informed');
    }
    return this.accountService.update(+accountId, input.name);
  }

  @Mutation(() => String)
  async deleteAccount(
    @Context('accountid') accountId: string,
  ): Promise<string> {
    if (!Number(accountId)) {
      throw new UnauthorizedException('accountId must be informed');
    }
    await this.accountService.delete(+accountId);
    return DELETED_ACCOUNT_MESSAGE;
  }
}
