import { Schedule } from '@prisma/client';
import { TaskModel } from './task.model';
import { AgentBaseModel } from './agent.model';
import { AccountBaseModel } from './account.model';

export type ScheduleBaseModel = Schedule;

export interface ScheduleModel extends ScheduleBaseModel {
  tasks: TaskModel[];
  account: AccountBaseModel;
  agent: AgentBaseModel;
}
