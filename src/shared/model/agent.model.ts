import { Agent } from '@prisma/client';

export type AgentModel = Agent;
export type AgentBaseModel = Omit<AgentModel, 'id'>;
