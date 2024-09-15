import { z } from "zod";

import { getEnvNumberValue, getEnvValue } from "@cinewrax/shared/lib/config.js";

export enum LogLevel {
  FATAL = "fatal",
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  TRACE = "trace",
}

const env = process.env;

export const config = {
  logLevel: getEnvValue(env, "LOG_LEVEL", z.nativeEnum(LogLevel).default(LogLevel.INFO)),
  port: getEnvNumberValue(env, "PORT", 8080),
  redisUrl: getEnvValue(env, "REDIS_URL", z.string().url()),
};
