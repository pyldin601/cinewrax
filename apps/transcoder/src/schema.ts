import camelcaseKeys from "camelcase-keys";
import { z } from "zod";
import { json, stringifiedNumber, url } from "./schema-shared.js";

// Encoding Parameters
export enum OutputFormat {
  MP3 = "mp3",
  WAV = "wav",
}

export const encodingParameters = z.union([
  z.object({
    format: z.literal(OutputFormat.MP3),
    bitrate: z.number().min(64_000).max(320_000),
  }),
  z.object({
    format: z.literal(OutputFormat.WAV),
  }),
]);

export type EncodingParameters = z.output<typeof encodingParameters>;

// Environment Variables
export enum SubmitMethod {
  PUT = "put",
  POST = "post",
}

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
    INPUT_FILE_URL: url(),
    INPUT_DOWNLOAD_RETRIES: stringifiedNumber().default(3),

    OUTPUT_FILE_URL: url(),
    OUTPUT_SUBMIT_METHOD: z.nativeEnum(SubmitMethod).default(SubmitMethod.PUT),
    OUTPUT_UPLOAD_RETRIES: stringifiedNumber().default(3),

    STATUS_REPORT_URL: url(),
    STATUS_REPORT_METHOD: z.nativeEnum(SubmitMethod).default(SubmitMethod.PUT),

    ENCODING_PARAMETERS: json().pipe(encodingParameters),

    LOG_LEVEL: z.nativeEnum(LogLevel).default(LogLevel.INFO),
  })
  .transform((config) => camelcaseKeys(config));
