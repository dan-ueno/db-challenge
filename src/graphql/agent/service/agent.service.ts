import { Injectable } from '@nestjs/common';
import { AgentModel, AgentDatasourceService } from 'shared';

@Injectable()
export class AgentService {
  constructor(private readonly agentDatasource: AgentDatasourceService) {}

  async findById(id: number): Promise<AgentModel> {
    return this.agentDatasource.findById(id);
  }

  async findByEmail(email: string): Promise<AgentModel> {
    return this.agentDatasource.findByEmail(email);
  }

  async create(name: string, email: string): Promise<AgentModel> {
    return this.agentDatasource.create(name, email);
  }

  async update(id: number, name: string): Promise<AgentModel> {
    await this.agentDatasource.findById(id);

    return this.agentDatasource.update(id, name);
  }

  async delete(id: number): Promise<void> {
    await this.agentDatasource.findById(id);

    return this.agentDatasource.delete(id);
  }
}
