import { Module } from '@nestjs/common';
import { AccountModule } from './acccount';
import { AgentModule } from './agent';

@Module({
  imports: [AccountModule, AgentModule],
})
export class GraphqlModule {}
