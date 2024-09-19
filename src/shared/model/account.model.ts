import { Account } from '@prisma/client';
import { ScheduleModel } from './schedule.model';
import { TaskModel } from './task.model';

export type AccountBaseModel = Account;

export interface AccountModel extends AccountBaseModel {
  schedules: ScheduleModel[];
  tasks: TaskModel[];
}
