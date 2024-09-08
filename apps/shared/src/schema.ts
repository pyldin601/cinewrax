import { z } from "zod";

export const stringifiedNumber = () => z.preprocess<z.ZodNumber>(Number, z.number());

export const json = () =>
  z.string().transform((content, ctx) => {
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

export const url = () =>
  z.string().transform((content, ctx) => {
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

export enum OutputFormat {
  MP3 = "mp3",
  WAV = "wav",
}

export const encodingParameters = z.union([
  z.object({
    format: z.literal(OutputFormat.MP3),
    bitrate: z.number().min(64_000).max(320_000),
  }),
  z.object({
    format: z.literal(OutputFormat.WAV),
  }),
]);

export type EncodingParameters = z.output<typeof encodingParameters>;
