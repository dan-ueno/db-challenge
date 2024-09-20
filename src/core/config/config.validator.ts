import { ConfigModuleOptions } from '@nestjs/config';
import { validationSchema } from './env';

export const ConfigValidator: ConfigModuleOptions = {
  isGlobal: true,
  validationSchema: validationSchema,
  validationOptions: { abortEarly: true },
};
