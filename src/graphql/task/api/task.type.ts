import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { AccountBaseModel, TaskBaseModel, TaskModel, TaskType } from 'shared';
import { AccountBase } from 'src/graphql/acccount/api/account.type';

@ObjectType()
export class TaskBase implements TaskBaseModel {
  @Field({ description: 'Task id' })
  id: string;

  @Field({ description: 'Schedule id which originated task' })
  scheduleId: string;

  @Field({ description: 'Account id' })
  accountId: number;

  @Field({ description: 'duration of the task, in days' })
  duration: number;

  @Field(() => GraphQLISODateTime, { description: 'Date of start' })
  startTime: Date;

  @Field(() => TaskType, { description: 'task of type work or break' })
  type: TaskType;
}

@ObjectType()
export class Task extends TaskBase implements TaskModel {
  @Field(() => AccountBase, {
    description: 'Account associated with the schedule',
  })
  account: AccountBaseModel;
}
