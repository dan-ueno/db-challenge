import { Module } from '@nestjs/common';
import { AccountModule } from './acccount';

@Module({
  imports: [AccountModule],
})
export class GraphqlModule {}
