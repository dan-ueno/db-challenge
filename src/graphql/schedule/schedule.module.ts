import { Module } from '@nestjs/common';
import { ScheduleResolver } from './api';
import { ScheduleService } from './service';
import {
  AgentDatasourceService,
  AccountDatasourceService,
  ScheduleDatasourceService,
} from 'shared/data';
import { CheckAccountUseCase } from '../task/service/use-case';

@Module({
  providers: [
    ScheduleResolver,
    ScheduleService,
    ScheduleDatasourceService,
    CheckAccountUseCase,
    AccountDatasourceService,
    AgentDatasourceService,
  ],
})
export class ScheduleModule {}
