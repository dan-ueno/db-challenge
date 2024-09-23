import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { TaskType } from 'shared';

@InputType()
export class CreateTaskInput {
  @Field({ description: 'Schedule id which originated task' })
  scheduleId: string;

  @Field(() => GraphQLISODateTime, { description: 'Start of Task' })
  startTime: string | Date;

  @Field({ description: 'duration of the task, in days' })
  duration: number;

  @Field(() => TaskType, { description: 'task of type work or break' })
  type: TaskType;
}

@InputType()
export class FindSchedulesTaskInput {
  @Field({ description: 'Schedule id which originated task' })
  scheduleId: string;
}

@InputType()
export class UpdateTaskInput {
  @Field({ description: 'id' })
  id: string;

  @Field(() => GraphQLISODateTime, {
    description: 'Date of start',
    nullable: true,
  })
  startTime?: string | Date;

  @Field({ description: 'duration of the task, in days', nullable: true })
  duration?: number;

  @Field(() => TaskType, {
    description: 'task of type work or break',
    nullable: true,
  })
  type?: TaskType;
}

@InputType()
export class DeleteTaskInput {
  @Field({ description: 'Task id' })
  id: string;
}
