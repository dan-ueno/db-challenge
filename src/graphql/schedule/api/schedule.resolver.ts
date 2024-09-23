import {
  CreateScheduleInput,
  DeleteScheduleInput,
  UpdateScheduleInput,
} from './schedule.input';
import { ScheduleService } from '../service/schedule.service';
import { Schedule, ScheduleBase } from './schedule.type';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { ScheduleBaseModel, ScheduleModel } from 'shared/model';

export const DELETED_SCHEDULE_MESSAGE = 'Schedule successsfully deleted';
export const UNAUTHORIZED_AGENT_MESSAGE = 'AgentId must be informed';
export const UNAUTHORIZED_ACCOUNT_MESSAGE = 'AccountId must be informed';

@Resolver()
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Query(() => [Schedule])
  async listSchedulesforAccount(
    @Context('accountid') accountId: string,
  ): Promise<ScheduleModel[]> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_ACCOUNT_MESSAGE);
    }
    return this.scheduleService.findAvailableByAccountId(+accountId);
  }

  @Query(() => [Schedule])
  async listSchedulesforAgent(
    @Context('agentid') agentId: string,
  ): Promise<ScheduleModel[]> {
    if (!Number(agentId)) {
      throw new UnauthorizedException(UNAUTHORIZED_AGENT_MESSAGE);
    }
    return this.scheduleService.findAvailableByAgentId(+agentId);
  }

  @Mutation(() => ScheduleBase)
  async createSchedule(
    @Context('accountid') accountId: string,
    @Args('data') input: CreateScheduleInput,
  ): Promise<ScheduleBaseModel> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_ACCOUNT_MESSAGE);
    }
    return this.scheduleService.create(+accountId, input);
  }

  @Mutation(() => ScheduleBase)
  async updateSchedule(
    @Context('accountid') accountId: string,
    @Args('data') input: UpdateScheduleInput,
  ): Promise<ScheduleBaseModel> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_ACCOUNT_MESSAGE);
    }
    return this.scheduleService.update(+accountId, input);
  }

  @Mutation(() => String)
  async deleteSchedule(
    @Context('accountid') accountId: string,
    @Args('data') input: DeleteScheduleInput,
  ): Promise<string> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_ACCOUNT_MESSAGE);
    }
    await this.scheduleService.delete(input.id, +accountId);
    return DELETED_SCHEDULE_MESSAGE;
  }
}
