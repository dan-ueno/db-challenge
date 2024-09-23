import {
  CreateTaskInput,
  DeleteTaskInput,
  FindSchedulesTaskInput,
  UpdateTaskInput,
} from './task.input';
import { TaskService } from '../service/task.service';
import { Task, TaskBase } from './task.type';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { TaskBaseModel, TaskModel } from 'shared/model';
import { AppLoggerService } from 'src/core/logger';

export const DELETED_TASK_MESSAGE = 'Task successsfully deleted';
export const UNAUTHORIZED_TASK_MESSAGE = 'AccountId must be informed';

@Resolver()
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly logger: AppLoggerService,
  ) {}

  @Query(() => [Task])
  async listTasks(
    @Context('accountid') accountId: string,
  ): Promise<TaskModel[]> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_TASK_MESSAGE);
    }
    return this.taskService.findAvailableByAccountId(+accountId);
  }

  @Query(() => [Task])
  async listTasksFromSchedule(
    @Context('accountid') accountId: string,
    @Args('data') input: FindSchedulesTaskInput,
  ): Promise<TaskModel[]> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_TASK_MESSAGE);
    }
    return this.taskService.findFromScheduleIdAndAccountId(
      input.scheduleId,
      +accountId,
    );
  }

  @Mutation(() => TaskBase)
  async createTask(
    @Context('accountid') accountId: string,
    @Args('data') input: CreateTaskInput,
  ): Promise<TaskBaseModel> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_TASK_MESSAGE);
    }
    return this.taskService.create(+accountId, input);
  }

  @Mutation(() => TaskBase)
  async updateTask(
    @Context('accountid') accountId: string,
    @Args('data') input: UpdateTaskInput,
  ): Promise<TaskBaseModel> {
    this.logger.log(`AQUIIII ${accountId}`);
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_TASK_MESSAGE);
    }
    return this.taskService.update(+accountId, input);
  }

  @Mutation(() => String)
  async deleteTask(
    @Context('accountid') accountId: string,
    @Args('data') input: DeleteTaskInput,
  ): Promise<string> {
    if (!Number(accountId)) {
      throw new UnauthorizedException(UNAUTHORIZED_TASK_MESSAGE);
    }
    await this.taskService.delete(input.id, +accountId);
    return DELETED_TASK_MESSAGE;
  }
}
