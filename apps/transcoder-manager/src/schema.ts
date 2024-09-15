import { z } from "zod";
import camelcaseKeys from "camelcase-keys";

import { encodingParameters, stringifiedNumber, url } from "@cinewrax/shared/lib/schema.js";

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
    SELF_ENDPOINT: z.string(),

    TRANSCODER_IMAGE_NAME: z.string(),
    TRANSCODER_IMAGE_TAG: z.string(),
    TRANSCODER_NAMESPACE: z.string(),
  })
  .transform((config) => camelcaseKeys(config));

export const transcodeRequestSchema = z.object({
  inputFileUrl: url(),
  outputFileUrl: url(),
  encodingParameters,
  userId: z.string().uuid(),
  requestId: z.string().uuid(),
});
