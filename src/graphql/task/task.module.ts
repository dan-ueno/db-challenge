import { Module } from '@nestjs/common';
import { TaskResolver } from './api';
import { TaskService } from './service';
import {
  AgentDatasourceService,
  AccountDatasourceService,
  TaskDatasourceService,
} from 'shared/data';
import { CheckAccountUseCase } from './service/use-case';
import { TaskType } from 'src/shared';
import { registerEnumType } from '@nestjs/graphql';

@Module({
  providers: [
    TaskResolver,
    TaskService,
    TaskDatasourceService,
    CheckAccountUseCase,
    AccountDatasourceService,
    AgentDatasourceService,
  ],
})
export class TaskModule {
  constructor() {
    registerEnumType(TaskType, {
      name: 'TaskType',
      description: 'define task as work or break',
    });
  }
}
