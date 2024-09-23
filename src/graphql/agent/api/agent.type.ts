import { Field, ObjectType } from '@nestjs/graphql';
import { AgentModel, AgentBaseModel } from 'shared';

@ObjectType()
export class Agent implements AgentModel {
  @Field({ description: 'Agent id' })
  id: number;

  @Field({ description: 'Agent name' })
  name: string;

  @Field({ description: 'Agent email' })
  email: string;
}

@ObjectType()
export class AgentBase implements AgentBaseModel {
  @Field({ description: 'Agent name' })
  name: string;

  @Field({ description: 'Agent email' })
  email: string;
}
