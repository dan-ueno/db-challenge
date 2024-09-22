import { Injectable } from '@nestjs/common';
import { AgentBaseModel, AgentDatasourceService, AgentModel } from 'shared';

@Injectable()
export class AgentService {
  constructor(private readonly agentDatasource: AgentDatasourceService) {}

  async findById(id: number): Promise<AgentBaseModel> {
    return this.agentDatasource.findById(id);
  }

  async findByEmail(email: string): Promise<AgentBaseModel> {
    return this.agentDatasource.findByEmail(email);
  }

  async create(name: string, email: string): Promise<AgentBaseModel> {
    return this.agentDatasource.create(name, email);
  }

  async update(id: number, name: string): Promise<AgentBaseModel> {
    await this.agentDatasource.findById(id);

    return this.agentDatasource.update(id, name);
  }

  async delete(id: number): Promise<void> {
    await this.agentDatasource.findById(id);

    return this.agentDatasource.delete(id);
  }
}
