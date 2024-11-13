import { Joi } from "express-validation";

export enum Environment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

/**
 * All possible environment configs
 */
export interface EnvConfig {
  NODE_ENV: Environment;
  PORT: number;
  ROUTE_PREFIX: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  PASSWORD_HASH_ROUNDS: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
}

let envConfig: EnvConfig;

/**
 * ENV config validation
 */
const envConfigValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .required(),
  PORT: Joi.number().required(),
  ROUTE_PREFIX: Joi.string().optional().default("/"),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  PASSWORD_HASH_ROUNDS: Joi.number().default(10),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().optional().allow(''),
}).unknown(true); // allow unknown keys

/**
 * Validating env on module load ensures that all env configs that are required are present.
 * This will save time debugging env related issues
 */
const { error, value } = envConfigValidation.validate(process.env);
if (error) {
  console.error("Env config is not valid for project", error);
  throw new Error(
    "Env config is not valid for project. Server might not run properly"
  );
}

// set env config
envConfig = value;

/**
 * Get env config for project
 * @returns - Env config
 */
export const getEnvConfig = (): EnvConfig => envConfig;

/**
 * Check if server is running in dev mode
 */
export const isDevMode = (env: Environment): boolean =>
  env === Environment.DEVELOPMENT;
