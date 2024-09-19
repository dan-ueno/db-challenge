import { Schedule } from '@prisma/client';
import { TaskModel } from './task.model';

export type ScheduleBaseModel = Schedule;

export interface ScheduleModel extends ScheduleBaseModel {
  tasks: TaskModel[];
}
