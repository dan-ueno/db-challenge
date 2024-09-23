import { Module } from '@nestjs/common';
import { AccountModule } from './account';
import { AgentModule } from './agent';
import { TaskModule } from './task';
import { ScheduleModule } from './schedule';

@Module({
  imports: [AccountModule, AgentModule, TaskModule, ScheduleModule],
})
export class GraphqlModule {}
