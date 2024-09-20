import { Module } from '@nestjs/common';
import { AccountResolver } from './api';
import { AccountService } from './service';
import { AccountDatasourceService } from 'shared';

@Module({
  providers: [AccountResolver, AccountService, AccountDatasourceService],
})
export class AccountModule {}
