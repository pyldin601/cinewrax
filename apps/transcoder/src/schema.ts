import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

const JsonSchema = z.string().transform((content, ctx) => {
  try {
    return JSON.parse(content);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid JSON",
    });
    return z.NEVER;
  }
});

const URLSchema = z.string().transform((content, ctx) => {
  try {
    return new URL(content);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid URL",
    });
    return z.NEVER;
  }
});

export enum EncodingFormat {
  MP3 = "mp3",
  WAV = "wav",
}

const MP3EncodingParametersSchema = z.object({
  format: z.literal(EncodingFormat.MP3),
  bitrate: z.number().min(64_000).max(320_000),
});

const WAVEncodingParametersSchema = z.object({
  format: z.literal(EncodingFormat.WAV),
});

export const EncodingParametersSchema = z.union([MP3EncodingParametersSchema, WAVEncodingParametersSchema]);

export const EnvVarsSchema = z
  .object({
    INPUT_FILE_URL: URLSchema,
    OUTPUT_FILE_URL: URLSchema,
    STATUS_REPORT_URL: URLSchema,
    ENCODING_PARAMETERS: JsonSchema.pipe(EncodingParametersSchema),
  })
  .transform((content) => camelcaseKeys(content));

export type EncodingParameters = z.output<typeof EncodingParametersSchema>;
