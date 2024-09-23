export * from './schedule.resolver';
import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';

@InputType()
export class CreateScheduleInput {
  @Field({ description: 'Agent id' })
  agentId: number;

  @Field(() => GraphQLISODateTime, { description: 'Start of Schedule' })
  startTime: string | Date;

  @Field(() => GraphQLISODateTime, { description: 'End of schedule' })
  endTime: string | Date;
}

@InputType()
export class UpdateScheduleInput {
  @Field({ description: 'id' })
  id: string;

  @Field({ description: 'AgentId', nullable: true })
  agentId?: number;

  @Field(() => GraphQLISODateTime, {
    description: 'Date of start',
    nullable: true,
  })
  startTime?: string | Date;

  @Field(() => GraphQLISODateTime, {
    description: 'Date to end',
    nullable: true,
  })
  endTime?: string | Date;
}

@InputType()
export class DeleteScheduleInput {
  @Field({ description: 'Schedule id' })
  id: string;
}
