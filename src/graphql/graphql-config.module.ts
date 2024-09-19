import { Env } from '@core/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GraphqlModule } from './graphql.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule, GraphqlModule],
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        playground: config.get(Env.GRAPHQL_SCHEMA_VISIBLE),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
      }),
    }),
  ],
})
export class GraphqlConfigModule {}
