import Joi from 'joi';

export const envFile = process.env.TEST === 'true' ? 'sample.env' : '.env';

const envSchema = {
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  DATABASE_POOL_MAX_CONNECTIONS: Joi.string().default(10),
  DATABASE_POOL_TIMEOUT: Joi.string().default(30),
};

export const validationSchema = Joi.object(envSchema);

type EnvType = keyof typeof envSchema;

export const Env = Object.fromEntries(
  Object.keys(envSchema).map((key: EnvType) => [key, key]),
) as Record<EnvType, string>;
