import { PrismaService } from '@core/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountBaseModel, AccountModel } from 'shared/model';

@Injectable()
export class AccountDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<AccountBaseModel> {
    try {
      return this.prisma.account.findFirstOrThrow({ where: { id } });
    } catch {
      throw new NotFoundException('Schedule not found');
    }
  }

  async findByEmail(email: string): Promise<AccountBaseModel | null> {
    return this.prisma.account.findFirst({ where: { email } });
  }

  async getById(id: number): Promise<AccountModel> {
    return this.prisma.account.findFirstOrThrow({
      where: { id },
      include: { schedules: { include: { tasks: true } }, tasks: true },
    });
  }

  async create(name: string, email: string): Promise<AccountBaseModel> {
    return this.prisma.account.create({
      data: {
        name,
        email,
      },
    });
  }

  async update(id: number, name: string): Promise<AccountBaseModel> {
    return this.prisma.account.update({ where: { id }, data: { name } });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.account.delete({ where: { id } });
    return;
  }
}
