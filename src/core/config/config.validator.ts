import { ConfigModuleOptions } from '@nestjs/config';
import { join } from 'path';
import { envFile, validationSchema } from './env';

export const ConfigValidator: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: validationSchema,
  validationOptions: { abortEarly: true },
  envFilePath: join(process.cwd(), envFile),
};
