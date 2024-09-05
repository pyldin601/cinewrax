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

const MP3EncodingParameters = z.object({
  format: z.literal("mp3"),
  bitrate: z.number().min(64).max(320),
});

const WAVEncodingParameters = z.object({
  format: z.literal("wav"),
});

export const EncodingParameters = z.union([MP3EncodingParameters, WAVEncodingParameters]);

export const EnvVarsSchema = z.object({
  INPUT_FILE_URL: z.string().url(),
  OUTPUT_FILE_URL: z.string().url(),
  STATUS_REPORT_URL: z.string().url(),
  ENCODING_PARAMETERS: JsonSchema.pipe(EncodingParameters),
});
