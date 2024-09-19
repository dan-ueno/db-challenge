import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { GraphqlConfigModule } from './graphql';
import { RestModule } from './rest';

@Module({
  imports: [CoreModule, GraphqlConfigModule, RestModule],
})
export class AppModule {}
