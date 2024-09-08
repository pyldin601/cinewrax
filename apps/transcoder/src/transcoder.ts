import fluentFfmpeg from "fluent-ffmpeg";
import retry from "p-retry";
import { serializeError } from "serialize-error";

import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";

import { assertUnreachable } from "./utils.js";
import { logger } from "./logger.js";
import { downloadFile, uploadFile } from "./fetch.js";
import { config } from "./config.js";
import { EncodingParameters, OutputFormat } from "./schema.js";
import { sendStatus, Status } from "./status.js";

async function transcodeFile(
  srcFilePath: string,
  dstFilePath: string,
  encodingParameters: EncodingParameters,
  onProgress: (percent: number) => void,
) {
  const ffmpegCommand = fluentFfmpeg(srcFilePath);

  switch (encodingParameters.format) {
    case OutputFormat.MP3:
      ffmpegCommand.format("mp3").audioBitrate(encodingParameters.bitrate);
      break;

    case OutputFormat.WAV:
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
      .on("progress", ({ percent }) => onProgress(percent ?? 0))
      .run();
  });
}

export async function transcode(inputFileUrl: URL, outputFileUrl: URL, encodingParameters: EncodingParameters) {
  await sendStatus({ status: Status.START });

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "cinewrax-"));
  logger.debug(`Temp dir created: ${tmpDir}`);

  const srcFileName = path.basename(inputFileUrl.pathname);
  const srcFilePath = path.join(tmpDir, srcFileName);

  const prefix = randomBytes(4).toString("hex");
  const dstFileName = `${prefix}-${path.basename(outputFileUrl.pathname)}`;
  const dstFilePath = path.join(tmpDir, dstFileName);

  try {
    logger.debug(`Downloading from ${inputFileUrl.toString()} to ${srcFilePath}`);
    await sendStatus({ status: Status.DOWNLOAD });
    await retry(() => downloadFile(inputFileUrl, srcFilePath), {
      onFailedAttempt(error) {
        logger.warn(
          { reason: error },
          `Download attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
        );
      },
      retries: config.inputDownloadRetries,
    }).catch(async (error: unknown) => {
      const serializedErr = serializeError(error);
      await sendStatus({ status: Status.DOWNLOAD_FAILED, reason: serializedErr.message });
      throw error;
    });

    logger.debug({ encodingParameters }, `Transcoding ${srcFilePath} to ${dstFilePath}`);
    await transcodeFile(srcFilePath, dstFilePath, encodingParameters, async (percent) => {
      await sendStatus({ status: Status.TRANSCODE, percent });
    }).catch(async (error: unknown) => {
      const serializedErr = serializeError(error);
      await sendStatus({ status: Status.TRANSCODE_FAILED, reason: serializedErr.message });
      throw error;
    });

    logger.debug(`Uploading ${dstFilePath} to ${outputFileUrl.toString()}`);
    await retry(() => uploadFile(dstFilePath, outputFileUrl), {
      onFailedAttempt(error) {
        logger.warn(
          { reason: error },
          `Upload attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
        );
      },
      retries: config.outputUploadRetries,
    }).catch(async (error: unknown) => {
      const serializedErr = serializeError(error);
      await sendStatus({ status: Status.UPLOAD_FAILED, reason: serializedErr.message });
      throw error;
    });

    await sendStatus({ status: Status.FINISH });
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
    logger.debug(`Temp dir deleted: ${tmpDir}`);
  }
}
