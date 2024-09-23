import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountDatasourceService } from 'src/shared';

export const ACCOUNT_UNAUTHORIZED_MESSAGE = 'Only accounts can manage tasks';

@Injectable()
export class CheckAccountUseCase {
  constructor(private readonly accountDatasource: AccountDatasourceService) {}
  async exec(accountId: number): Promise<void> {
    const account = await this.accountDatasource.findById(accountId);
    if (!account) {
      throw new UnauthorizedException(ACCOUNT_UNAUTHORIZED_MESSAGE);
    }
    return;
  }
}
