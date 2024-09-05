import fluentFfmpeg from "fluent-ffmpeg";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import retry from "p-retry";

import { EncodingFormat, EncodingParameters } from "./schema.js";
import { assertUnreachable } from "./utils.js";
import { logger } from "./logger.js";
import { downloadFile, uploadFile } from "./fetch.js";
import { MAX_DOWNLOAD_ATTEMPTS, MAX_UPLOAD_ATTEMPTS } from "./config.js";

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
    await retry(() => downloadFile(inputFileUrl, srcFilePath), {
      onFailedAttempt(error) {
        logger.warn(
          { reason: error },
          `Download attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
        );
      },
      retries: MAX_DOWNLOAD_ATTEMPTS,
    });

    await transcodeFile(srcFilePath, dstFilePath, encodingParameters);

    await retry(() => uploadFile(dstFilePath, outputFileUrl), {
      onFailedAttempt(error) {
        logger.warn(
          { reason: error },
          `Upload attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
        );
      },
      retries: MAX_UPLOAD_ATTEMPTS,
    });
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}
