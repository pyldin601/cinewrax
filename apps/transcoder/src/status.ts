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

type StatusResponse =
  | { status: Status.START }
  | { status: Status.DOWNLOAD }
  | { status: Status.DOWNLOAD_FAILED; reason?: string }
  | { status: Status.TRANSCODE; percent: number }
  | { status: Status.TRANSCODE_FAILED; reason?: string }
  | { status: Status.UPLOAD }
  | { status: Status.UPLOAD_FAILED; reason?: string }
  | { status: Status.FINISH };

export async function sendStatus(_resp: StatusResponse): Promise<void> {
  // TODO
}
