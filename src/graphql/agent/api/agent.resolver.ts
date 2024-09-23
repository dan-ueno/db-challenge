import {
  AgentByEmailInput,
  UpdateAgentInput,
  CreateAgentInput,
} from './agent.input';
import { AgentService } from '../service/agent.service';
import { Agent } from './agent.type';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { AgentModel } from 'shared/model';

export const DELETED_AGENT_MESSAGE = 'Agent successsfully deleted';
export const UNAUTHORIZED_AGENT_MESSAGE = 'AgentId must be informed';

@Resolver()
export class AgentResolver {
  constructor(private readonly agentService: AgentService) {}

  @Query(() => Agent)
  async getAgent(@Args('data') input: AgentByEmailInput): Promise<AgentModel> {
    return this.agentService.findByEmail(input.email);
  }

  @Mutation(() => Agent)
  async createAgent(
    @Args('data') input: CreateAgentInput,
  ): Promise<AgentModel> {
    return this.agentService.create(input.name, input.email);
  }

  @Mutation(() => Agent)
  async updateAgent(
    @Context('agentid') agentId: string,
    @Args('data') input: UpdateAgentInput,
  ): Promise<AgentModel> {
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
