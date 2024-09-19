import { AccountByIdInput } from './account.input';
import { AccountService } from '../service/account.service';
import { AccountBase } from './account.type';
import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => AccountBase)
  async getAccount(
    @Args('data') input: AccountByIdInput,
  ): Promise<AccountBase> {
    return this.accountService.findById(input.id);
  }
}
