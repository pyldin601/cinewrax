import { EnvVarsSchema } from "./schema.js";
import { logger } from "./logger.js";
import * as process from "node:process";
import { ERRONEOUS_EXIT_CODE } from "./config.js";
import { transcode } from "./transcoder.js";
import { serializeError } from "serialize-error";

const result = EnvVarsSchema.safeParse(process.env);
if (!result.success) {
  logger.error({ reason: result.error.flatten() }, "One or more variables are missing or have invalid formats.");
  process.exit(ERRONEOUS_EXIT_CODE);
}
const { inputFileUrl, outputFileUrl, encodingParameters } = result.data;

try {
  await transcode(inputFileUrl, outputFileUrl, encodingParameters);
} catch (error) {
  const serializedError = serializeError(error);
  logger.error({ reason: serializedError }, "The input file may be corrupted or unsupported.");
  process.exit(ERRONEOUS_EXIT_CODE);
}

process.exit(0);
