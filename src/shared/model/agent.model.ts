import { Agent } from '@prisma/client';
import { ScheduleModel } from './schedule.model';

export type AgentBaseModel = Agent;

export interface AgentModel extends AgentBaseModel {
  schedules: ScheduleModel[];
}
