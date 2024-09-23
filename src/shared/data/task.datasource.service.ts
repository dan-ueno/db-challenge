import { PrismaService } from '@core/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import { TaskType, TaskBaseModel, TaskModel } from 'shared/model';

export type CreateTaskInputData = Omit<Prisma.TaskUncheckedCreateInput, 'id'>;

export interface UpdateTaskInputData {
  startTime?: Date | string;
  duration?: number;
  type?: TaskType;
}

export const TASK_NOT_FOUND_MESSAGE = 'Task not found';

@Injectable()
export class TaskDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<TaskBaseModel> {
    try {
      return this.prisma.task.findFirstOrThrow({ where: { id } });
    } catch {
      throw new NotFoundException(TASK_NOT_FOUND_MESSAGE);
    }
  }

  async findAllTasksByAccountId(id: number): Promise<TaskBaseModel[]> {
    return this.prisma.task.findMany({ where: { accountId: id } }) ?? [];
  }

  async findAvailableByAccountId(id: number): Promise<TaskModel[]> {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const tasks: TaskModel[] = await this.prisma.$queryRaw`
    SELECT t.*, a.*
    FROM task t
    JOIN account a ON t.account_id = a.id
    WHERE t.account_id = ${id}
      AND t.start_time <= ${todayEnd}
      AND t.start_time + INTERVAL '1 day' * t.duration >= ${todayStart}
  `;
    return tasks ?? [];
  }

  async findAvailableByScheduleIdAndAccountId(
    scheduleId: string,
    accountId: number,
  ): Promise<TaskModel[]> {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const tasks: TaskModel[] = await this.prisma.$queryRaw`
    SELECT t.*, a.*
    FROM task t
    JOIN account a ON t.account_id = a.id
    WHERE t.account_id = ${accountId}
      AND t.schedule_id = ${scheduleId}
      AND t.start_time <= ${todayEnd}
      AND t.start_time + INTERVAL '1 day' * t.duration >= ${todayStart}
  `;
    return tasks ?? [];
  }

  async create(data: CreateTaskInputData): Promise<TaskBaseModel> {
    return this.prisma.task.create({ data });
  }

  async update(id: string, data: UpdateTaskInputData): Promise<TaskBaseModel> {
    return this.prisma.task.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
    return;
  }
}
