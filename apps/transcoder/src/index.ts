import { z } from "zod";

const EnvVarsSchema = z.object({
  INPUT_FILE_URL: z.string().url(),
  OUTPUT_FILE_URL: z.string().url(),
  STATUS_REPORT_URL: z.string().url(),
});

await Promise.resolve();
