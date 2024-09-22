import { PrismaService } from '@core/database';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountBaseModel, AccountModel } from 'shared/model';

export const NOT_FOUND_ACCOUNT_MESSAGE = 'Account not found';
export const CONFLICT_ACCOUNT_MESSAGE = 'Email already registered';

@Injectable()
export class AccountDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<AccountBaseModel> {
    let account: AccountBaseModel;
    try {
      account = await this.prisma.account.findFirstOrThrow({ where: { id } });
    } catch {
      throw new NotFoundException(NOT_FOUND_ACCOUNT_MESSAGE);
    }
    return account;
  }

  async findByEmail(email: string): Promise<AccountBaseModel> {
    let account: AccountBaseModel;
    try {
      account = await this.prisma.account.findFirstOrThrow({
        where: { email },
      });
    } catch {
      throw new NotFoundException(NOT_FOUND_ACCOUNT_MESSAGE);
    }
    return account;
  }

  async create(name: string, email: string): Promise<AccountBaseModel> {
    let account: AccountBaseModel;
    try {
      account = await this.prisma.account.create({
        data: {
          name,
          email,
        },
      });
    } catch {
      throw new ConflictException(CONFLICT_ACCOUNT_MESSAGE);
    }
    return account;
  }

  async update(id: number, name: string): Promise<AccountBaseModel> {
    return this.prisma.account.update({ where: { id }, data: { name } });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.account.delete({ where: { id } });
    return;
  }
}
