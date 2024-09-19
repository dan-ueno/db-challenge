import { Field, ObjectType } from '@nestjs/graphql';
import { AccountBaseModel } from 'shared';

@ObjectType()
export class AccountBase implements AccountBaseModel {
  @Field({ description: 'Account id' })
  id: number;

  @Field({ description: 'Account name' })
  name: string;

  @Field({ description: 'Account email' })
  email: string;
}
