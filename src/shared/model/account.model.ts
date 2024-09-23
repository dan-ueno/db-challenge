import { Account } from '@prisma/client';

export type AccountModel = Account;
export type AccountBaseModel = Omit<AccountModel, 'id'>;
