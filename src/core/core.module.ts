import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigValidator } from './config';
import { LoggerModule } from './logger';

@Global()
@Module({
  imports: [ConfigModule.forRoot(ConfigValidator), LoggerModule, PrismaModule],
})
export class CoreModule {}
