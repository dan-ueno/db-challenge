import { PrismaService } from '@core/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleBaseModel, ScheduleModel } from 'shared/model';
import { Prisma } from '@prisma/client';

type CreateScheduleInputData = Omit<
  Prisma.ScheduleUncheckedCreateInput,
  'id' | 'tasks'
>;

interface UpdateScheduleInputData {
  agentId?: number;
  startTime?: Date | string;
  endTime?: Date | string;
}

@Injectable()
export class ScheduleDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ScheduleBaseModel> {
    try {
      return this.prisma.schedule.findFirstOrThrow({ where: { id } });
    } catch {
      throw new NotFoundException('Schedule not found');
    }
  }

  async getById(id: string): Promise<ScheduleModel> {
    return this.prisma.schedule.findFirstOrThrow({
      where: { id },
      include: { tasks: true },
    });
  }

  async create(data: CreateScheduleInputData): Promise<ScheduleBaseModel> {
    return this.prisma.schedule.create({ data });
  }

  async update(
    id: string,
    data: UpdateScheduleInputData,
  ): Promise<ScheduleBaseModel> {
    return this.prisma.schedule.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.schedule.delete({ where: { id } });
    return;
  }
}
