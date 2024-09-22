import { Module } from '@nestjs/common';
import { AgentResolver } from './api';
import { AgentService } from './service';
import { AgentDatasourceService } from 'shared';

@Module({
  providers: [AgentResolver, AgentService, AgentDatasourceService],
})
export class AgentModule {}
