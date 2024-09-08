import { serializeError } from "serialize-error";
import { sendStatus as _sendStatus } from "./fetch.js";
import { logger } from "./logger.js";

export enum Status {
  START = "start",
  DOWNLOAD = "download",
  DOWNLOAD_FAILED = "download-failed",
  TRANSCODE = "transcode",
  TRANSCODE_FAILED = "transcode-failed",
  UPLOAD = "upload",
  UPLOAD_FAILED = "upload-failed",
  FINISH = "finish",
}

export type StatusResponse =
  | { status: Status.START }
  | { status: Status.DOWNLOAD }
  | { status: Status.DOWNLOAD_FAILED; reason?: string }
  | { status: Status.TRANSCODE; percent: number }
  | { status: Status.TRANSCODE_FAILED; reason?: string }
  | { status: Status.UPLOAD }
  | { status: Status.UPLOAD_FAILED; reason?: string }
  | { status: Status.FINISH };

export async function sendStatus(status: StatusResponse): Promise<void> {
  try {
    logger.debug({ status }, "Sending transcoding status");
    await _sendStatus(status);
  } catch (error) {
    const serializedError = serializeError(error);

    logger.warn({ reason: serializedError }, "Unable to send transcoding status");
  }
}
