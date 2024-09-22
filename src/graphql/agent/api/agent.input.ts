import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAgentInput {
  @Field({ description: 'Agent id' })
  name: string;

  @Field({ description: 'Agent email' })
  email: string;
}

@InputType()
export class AgentByEmailInput {
  @Field({ description: 'Agent email' })
  email: string;
}

@InputType()
export class UpdateAgentInput {
  @Field({ description: 'Agent name' })
  name: string;
}
