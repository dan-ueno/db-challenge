import { Field, ObjectType } from '@nestjs/graphql';
import { AccountBaseModel, AccountModel } from 'shared';

@ObjectType()
export class Account implements AccountModel {
  @Field({ description: 'Account id' })
  id: number;

  @Field({ description: 'Account name' })
  name: string;

  @Field({ description: 'Account email' })
  email: string;
}

@ObjectType()
export class AccountBase implements AccountBaseModel {
  @Field({ description: 'Account name' })
  name: string;

  @Field({ description: 'Account email' })
  email: string;
}
