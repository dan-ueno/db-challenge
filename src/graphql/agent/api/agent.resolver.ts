import {
  AgentByEmailInput,
  UpdateAgentInput,
  CreateAgentInput,
} from './agent.input';
import { AgentService } from '../service/agent.service';
import { AgentBase } from './agent.type';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { AgentBaseModel } from 'shared/model';

export const DELETED_AGENT_MESSAGE = 'Agent successsfully deleted';
export const UNAUTHORIZED_AGENT_MESSAGE = 'AgentId must be informed';

@Resolver()
export class AgentResolver {
  constructor(private readonly agentService: AgentService) {}

  @Query(() => AgentBase)
  async getAgent(
    @Args('data') input: AgentByEmailInput,
  ): Promise<AgentBaseModel> {
    return this.agentService.findByEmail(input.email);
  }

  @Mutation(() => AgentBase)
  async createAgent(
    @Args('data') input: CreateAgentInput,
  ): Promise<AgentBaseModel> {
    return this.agentService.create(input.name, input.email);
  }

  @Mutation(() => AgentBase)
  async updateAgent(
    @Context('agentid') agentId: string,
    @Args('data') input: UpdateAgentInput,
  ): Promise<AgentBaseModel> {
    if (!Number(agentId)) {
      throw new UnauthorizedException(UNAUTHORIZED_AGENT_MESSAGE);
    }
    return this.agentService.update(+agentId, input.name);
  }

  @Mutation(() => String)
  async deleteAgent(@Context('agentid') agentId: string): Promise<string> {
    if (!Number(agentId)) {
      throw new UnauthorizedException(UNAUTHORIZED_AGENT_MESSAGE);
    }
    await this.agentService.delete(+agentId);
    return DELETED_AGENT_MESSAGE;
  }
}
