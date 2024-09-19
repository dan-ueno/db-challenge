import { PrismaService } from '@core/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentBaseModel, AgentModel } from 'shared/model';

@Injectable()
export class AgentDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<AgentBaseModel> {
    try {
      return this.prisma.agent.findFirstOrThrow({ where: { id } });
    } catch {
      throw new NotFoundException('Schedule not found');
    }
  }

  async findByEmail(email: string): Promise<AgentBaseModel | null> {
    return this.prisma.agent.findFirst({ where: { email } });
  }

  async getById(id: number): Promise<AgentModel> {
    return this.prisma.agent.findFirstOrThrow({
      where: { id },
      include: { schedules: { include: { tasks: true } } },
    });
  }

  async create(name: string, email: string): Promise<AgentBaseModel> {
    return this.prisma.agent.create({
      data: {
        name,
        email,
      },
    });
  }

  async update(id: number, name: string): Promise<AgentBaseModel> {
    return this.prisma.agent.update({ where: { id }, data: { name } });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.agent.delete({ where: { id } });
    return;
  }
}
