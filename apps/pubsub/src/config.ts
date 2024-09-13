import { envVars } from "./schema.js";

const envs = envVars.safeParse(process.env);

if (!envs.success) {
  throw new Error("One or more environment variables are missing or have invalid values.", {
    cause: envs.error.format(),
  });
}

export const config = envs.data;
