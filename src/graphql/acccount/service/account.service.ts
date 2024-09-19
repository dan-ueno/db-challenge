import { Injectable } from '@nestjs/common';
import { AccountBaseModel, AccountDatasourceService } from 'shared';

@Injectable()
export class AccountService {
  constructor(private readonly accountDatasource: AccountDatasourceService) {}

  async findById(id: number): Promise<AccountBaseModel> {
    return this.accountDatasource.findById(id);
  }
}
