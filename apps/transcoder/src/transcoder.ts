import fluentFfmpeg from "fluent-ffmpeg";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { EncodingFormat, EncodingParameters } from "./schema.js";
import { assertUnreachable } from "./utils.js";
import { logger } from "./logger.js";
import { downloadFile, uploadFile } from "./fetch.js";

async function transcodeFile(srcFilePath: string, dstFilePath: string, encodingParameters: EncodingParameters) {
  const ffmpegCommand = fluentFfmpeg(srcFilePath);

  switch (encodingParameters.format) {
    case EncodingFormat.MP3:
      ffmpegCommand.format("mp3").audioBitrate(encodingParameters.bitrate);
      break;

    case EncodingFormat.WAV:
      ffmpegCommand.format("wav");
      break;

    default:
      assertUnreachable(encodingParameters);
  }

  return new Promise<void>((resolve, reject) => {
    ffmpegCommand
      .output(dstFilePath)
      .on("end", () => resolve())
      .on("error", (error) => reject(error))
      .on("progress", ({ percent }) => logger.debug(`Encoding ${percent}%`))
      .run();
  });
}

export async function transcode(inputFileUrl: URL, outputFileUrl: URL, encodingParameters: EncodingParameters) {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "cinewrax-"));

  const srcFileName = path.basename(inputFileUrl.pathname);
  const srcFilePath = path.join(tmpDir, srcFileName);

  const dstFileName = path.basename(outputFileUrl.pathname);
  const dstFilePath = path.join(tmpDir, dstFileName);

  try {
    // TODO: Should be retried.
    await downloadFile(inputFileUrl, srcFilePath);
    await transcodeFile(srcFilePath, dstFilePath, encodingParameters);
    // TODO: Should be retried.
    await uploadFile(dstFilePath, outputFileUrl);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}
