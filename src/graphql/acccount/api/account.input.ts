import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccountInput {
  @Field({ description: 'Account id' })
  name: string;

  @Field({ description: 'Account email' })
  email: string;
}

@InputType()
export class AccountByEmailInput {
  @Field({ description: 'Account email' })
  email: string;
}

@InputType()
export class UpdateAccountInput {
  @Field({ description: 'Account name' })
  name: string;
}
