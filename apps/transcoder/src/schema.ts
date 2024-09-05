import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

const JsonSchema = z.string().transform((content, ctx) => {
  try {
    return JSON.parse(content);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "invalid json",
    });
    return z.never;
  }
});

const MP3EncodingParametersSchema = z.object({
  format: z.literal("mp3"),
  bitrate: z.number().min(64).max(320),
});

const WAVEncodingParametersSchema = z.object({
  format: z.literal("wav"),
});

export const EncodingParametersSchema = z.union([MP3EncodingParametersSchema, WAVEncodingParametersSchema]);

export const EnvVarsSchema = z
  .object({
    INPUT_FILE_URL: z.string().url(),
    OUTPUT_FILE_URL: z.string().url(),
    STATUS_REPORT_URL: z.string().url(),
    ENCODING_PARAMETERS: JsonSchema.pipe(EncodingParametersSchema),
  })
  .transform((content) => camelcaseKeys(content));

export type EncodingParameters = z.output<typeof EncodingParametersSchema>;
