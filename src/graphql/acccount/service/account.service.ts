import { Injectable } from '@nestjs/common';
import { AccountModel, AccountDatasourceService } from 'shared';

@Injectable()
export class AccountService {
  constructor(private readonly accountDatasource: AccountDatasourceService) {}

  async findById(id: number): Promise<AccountModel> {
    return this.accountDatasource.findById(id);
  }

  async findByEmail(email: string): Promise<AccountModel> {
    return this.accountDatasource.findByEmail(email);
  }

  async create(name: string, email: string): Promise<AccountModel> {
    return this.accountDatasource.create(name, email);
  }

  async update(id: number, name: string): Promise<AccountModel> {
    await this.accountDatasource.findById(id);

    return this.accountDatasource.update(id, name);
  }

  async delete(id: number): Promise<void> {
    await this.accountDatasource.findById(id);

    return this.accountDatasource.delete(id);
  }
}
