import { EnvVarsSchema } from "./schema.js";
import { logger } from "./logger.js";
import * as process from "node:process";
import { ERRONEOUS_EXIT_CODE } from "./config.js";
import { transcode } from "./transcoder.js";

const result = EnvVarsSchema.safeParse(process.env);
if (!result.success) {
  logger.error({ reason: result.error }, "Unable to parse environment variables");
  process.exit(ERRONEOUS_EXIT_CODE);
}
const { inputFileUrl, outputFileUrl, encodingParameters } = result.data;

try {
  await transcode(inputFileUrl, outputFileUrl, encodingParameters);
} catch (error) {
  logger.error({ reason: error }, "Unable to transcode file");
  process.exit(ERRONEOUS_EXIT_CODE);
}
