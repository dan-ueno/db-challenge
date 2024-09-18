import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Env } from '@core/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: `${config.get(Env.DATABASE_URL)}?connection-limit=${config.get(Env.DATABASE_POOL_MAX_CONNECTIONS)}&pool_timeout=${config.get(Env.DATABASE_POOL_TIMEOUT)}`,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutDownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
