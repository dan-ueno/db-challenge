import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  CreateTaskInputData,
  TaskBaseModel,
  TaskDatasourceService,
  TaskModel,
  UpdateTaskInputData,
} from 'shared';
import { ACCOUNT_UNAUTHORIZED_MESSAGE, CheckAccountUseCase } from './use-case';

export const UNAUTHORIZED_TO_DELETE_MESSAGE = 'Only the owner can delete task';
export const UNAUTHORIZED_TO_UPDATE_MESSAGE = 'Only the owner can edit task';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskDatasource: TaskDatasourceService,
    private readonly checkAccountUseCase: CheckAccountUseCase,
  ) {}

  async findAvailableByAccountId(id: number): Promise<TaskModel[]> {
    return this.taskDatasource.findAvailableByAccountId(id);
  }

  async findFromScheduleIdAndAccountId(
    scheduleId: string,
    accountId: number,
  ): Promise<TaskModel[]> {
    return this.taskDatasource.findAvailableByScheduleIdAndAccountId(
      scheduleId,
      accountId,
    );
  }

  async create(
    accountId: number,
    input: Omit<CreateTaskInputData, 'accountId'>,
  ): Promise<TaskBaseModel> {
    await this.checkAccountUseCase.exec(accountId);

    return this.taskDatasource.create({ ...input, accountId });
  }

  async update(
    accountId: number,
    input: UpdateTaskInputData & { id: string },
  ): Promise<TaskBaseModel> {
    const { id, ...dataToUpdate } = input;
    await this.checkAccountUseCase.exec(accountId);

    const task = await this.taskDatasource.findById(id);
    if (task.accountId !== accountId) {
      throw new UnauthorizedException(ACCOUNT_UNAUTHORIZED_MESSAGE);
    }

    const updatedTask = await this.taskDatasource.update(id, dataToUpdate);
    return updatedTask;
  }

  async delete(id: string, accountId: number): Promise<void> {
    await this.checkAccountUseCase.exec(accountId);

    const task = await this.taskDatasource.findById(id);
    if (task.accountId !== accountId) {
      throw new UnauthorizedException(UNAUTHORIZED_TO_DELETE_MESSAGE);
    }

    return this.taskDatasource.delete(id);
  }
}
