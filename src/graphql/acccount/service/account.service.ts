import { Injectable } from '@nestjs/common';
import {
  AccountBaseModel,
  AccountDatasourceService,
  AccountModel,
} from 'shared';

@Injectable()
export class AccountService {
  constructor(private readonly accountDatasource: AccountDatasourceService) {}

  async findById(id: number): Promise<AccountBaseModel> {
    return this.accountDatasource.findById(id);
  }

  async findByEmail(email: string): Promise<AccountBaseModel> {
    return this.accountDatasource.findByEmail(email);
  }

  async create(name: string, email: string): Promise<AccountBaseModel> {
    return this.accountDatasource.create(name, email);
  }

  async update(id: number, name: string): Promise<AccountBaseModel> {
    await this.accountDatasource.findById(id);

    return this.accountDatasource.update(id, name);
  }

  async delete(id: number): Promise<void> {
    await this.accountDatasource.findById(id);

    return this.accountDatasource.delete(id);
  }
}
