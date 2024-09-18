import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from '@core/logger';

async function bootstrap() {
  const logger = new AppLoggerService();
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 8080;

  await app.listen(port);
  logger.log({ message: `Server is running on port ${port}` });

  process.on('SIGTERM', () => {
    app.close().then(() => {
      console.info('Server closed');
    });
  });
}

bootstrap();
