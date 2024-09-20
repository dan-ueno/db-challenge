import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AccountByIdInput {
  @Field({ description: 'Account id' })
  id: number;
}

@InputType()
export class AccountByEmailInput {
  @Field({ description: 'Account email' })
  email: string;
}
