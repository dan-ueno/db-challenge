import { PrismaService } from '@core/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskType, TaskModel } from 'shared/model';

type CreateTaskInputData = Omit<Prisma.TaskUncheckedCreateInput, 'id'>;

interface UpdateTaskInputData {
  startTime?: Date | string;
  duration?: number;
  type?: TaskType;
}

@Injectable()
export class TaskDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<TaskModel> {
    try {
      return this.prisma.task.findFirstOrThrow({ where: { id } });
    } catch {
      throw new NotFoundException('Task not found');
    }
  }

  async create(data: CreateTaskInputData): Promise<TaskModel> {
    return this.prisma.task.create({ data });
  }

  async update(id: string, data: UpdateTaskInputData): Promise<TaskModel> {
    return this.prisma.task.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.schedule.delete({ where: { id } });
    return;
  }
}
