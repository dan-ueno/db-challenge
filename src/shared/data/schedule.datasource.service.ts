import { PrismaService } from '@core/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleBaseModel, ScheduleModel } from 'shared/model';
import { Prisma } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';

export type CreateScheduleInputData = Omit<
  Prisma.ScheduleUncheckedCreateInput,
  'id' | 'tasks'
>;

export interface UpdateScheduleInputData {
  agentId?: number;
  startTime?: Date | string;
  endTime?: Date | string;
}

const SCHEDULE_NOT_FOUND_MESSAGE = 'Schedule not found';

@Injectable()
export class ScheduleDatasourceService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ScheduleBaseModel> {
    let schedule: ScheduleBaseModel;
    try {
      schedule = await this.prisma.schedule.findFirstOrThrow({
        where: { id },
      });
    } catch {
      throw new NotFoundException(SCHEDULE_NOT_FOUND_MESSAGE);
    }
    return schedule;
  }

  async findAvailableByAccountId(id: number): Promise<ScheduleModel[]> {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const schedules: ScheduleModel[] = await this.prisma.schedule.findMany({
      where: {
        accountId: id,
        startTime: { lte: todayEnd },
        endTime: { gte: todayStart },
      },
      include: {
        account: true,
        agent: true,
        tasks: { include: { account: true } },
      },
    });
    return schedules ?? [];
  }

  async findAvailableByAgentId(id: number): Promise<ScheduleModel[]> {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const schedules: ScheduleModel[] = await this.prisma.schedule.findMany({
      where: {
        agentId: id,
        startTime: { lte: todayEnd },
        endTime: { gte: todayStart },
      },
      include: {
        account: true,
        agent: true,
        tasks: { include: { account: true } },
      },
    });
    return schedules ?? [];
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
