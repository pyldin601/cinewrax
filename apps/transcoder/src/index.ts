import { EnvVarsSchema } from "./schema.js";
import { logger } from "./logger.js";
import * as process from "node:process";
import { ERRONEOUS_EXIT_CODE } from "./config.js";

const result = EnvVarsSchema.safeParse(process.env);
if (!result.success) {
  logger.error({ error: result.error }, "Unable to parse environment variables");
  process.exit(ERRONEOUS_EXIT_CODE);
}
