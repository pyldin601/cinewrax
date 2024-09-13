import { z } from "zod";
import camelcaseKeys from "camelcase-keys";

import { stringifiedNumber } from "@cinewrax/shared/lib/schema.js";

export enum LogLevel {
  FATAL = "fatal",
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  TRACE = "trace",
}

export const envVars = z
  .object({
    PORT: stringifiedNumber().default(8080),
    LOG_LEVEL: z.nativeEnum(LogLevel).default(LogLevel.INFO),
  })
  .transform((config) => camelcaseKeys(config));
