import { Field, ObjectType } from '@nestjs/graphql';
import { AgentBaseModel } from 'shared';

@ObjectType()
export class AgentBase implements AgentBaseModel {
  @Field({ description: 'Agent id' })
  id: number;

  @Field({ description: 'Agent name' })
  name: string;

  @Field({ description: 'Agent email' })
  email: string;
}
