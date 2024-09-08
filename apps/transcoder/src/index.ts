import { serializeError } from "serialize-error";

import { exit } from "node:process";

import { logger } from "./logger.js";
import { transcode } from "./transcoder.js";
import { config } from "./config.js";

try {
  await transcode(config.inputFileUrl, config.outputFileUrl, config.encodingParameters);

  exit(0);
} catch (error) {
  const serializedError = serializeError(error);
  logger.error({ reason: serializedError }, "The input file may be corrupted or unsupported.");

  exit(1);
}
