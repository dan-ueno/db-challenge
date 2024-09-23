import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  AccountBaseModel,
  AgentBaseModel,
  ScheduleBaseModel,
  ScheduleModel,
  TaskModel,
} from 'shared';
import { AccountBase } from 'src/graphql/account/api/account.type';
import { AgentBase } from 'src/graphql/agent/api/agent.type';
import { Task } from 'src/graphql/task/api/task.type';

@ObjectType()
export class ScheduleBase implements ScheduleBaseModel {
  @Field({ description: 'Schedule id' })
  id: string;

  @Field({ description: 'Account id' })
  accountId: number;

  @Field({ description: 'Agent id' })
  agentId: number;

  @Field(() => GraphQLISODateTime, { description: 'Date of start' })
  startTime: Date;

  @Field(() => GraphQLISODateTime, { description: 'Date to end' })
  endTime: Date;
}

@ObjectType()
export class Schedule extends ScheduleBase implements ScheduleModel {
  @Field(() => AccountBase, {
    description: 'Account associated with the schedule',
  })
  account: AccountBaseModel;

  @Field(() => AgentBase, { description: 'Agent assigned to the schedule' })
  agent: AgentBaseModel;

  @Field(() => [Task], { description: 'schedules tasks' })
  tasks: TaskModel[];
}
