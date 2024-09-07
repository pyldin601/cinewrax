import { logger } from "./logger.js";
import { envVars } from "./schema.js";

const envs = envVars.safeParse(process.env);

if (!envs.success) {
  logger.error(
    { reason: envs.error.format() },
    "One or more environment variables are missing or have invalid formats.",
  );
  process.exit(1);
}

export const config = envs.data;
