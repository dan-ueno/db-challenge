import { PrismaService } from '@core/database';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AgentModel } from 'shared/model';

export const NOT_FOUND_AGENT_MESSAGE = 'Agent not found';
export const CONFLICT_AGENT_MESSAGE = 'Email already registered';

@Injectable()
export class AgentDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<AgentModel> {
    let agent: AgentModel;
    try {
      agent = await this.prisma.agent.findFirstOrThrow({ where: { id } });
    } catch {
      throw new NotFoundException(NOT_FOUND_AGENT_MESSAGE);
    }
    return agent;
  }

  async findByEmail(email: string): Promise<AgentModel> {
    let agent: AgentModel;
    try {
      agent = await this.prisma.agent.findFirstOrThrow({ where: { email } });
    } catch {
      throw new NotFoundException(NOT_FOUND_AGENT_MESSAGE);
    }
    return agent;
  }

  async create(name: string, email: string): Promise<AgentModel> {
    let agent: AgentModel;
    try {
      agent = await this.prisma.agent.create({
        data: {
          name,
          email,
        },
      });
    } catch {
      throw new ConflictException(CONFLICT_AGENT_MESSAGE);
    }
    return agent;
  }

  async update(id: number, name: string): Promise<AgentModel> {
    return this.prisma.agent.update({ where: { id }, data: { name } });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.agent.delete({ where: { id } });
    return;
  }
}
