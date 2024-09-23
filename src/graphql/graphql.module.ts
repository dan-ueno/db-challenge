import { Module } from '@nestjs/common';
import { AccountModule } from './acccount';
import { AgentModule } from './agent';
import { TaskModule } from './task';

@Module({
  imports: [AccountModule, AgentModule, TaskModule],
})
export class GraphqlModule {}
