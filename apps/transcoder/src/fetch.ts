import fs from "node:fs";
import { stat } from "node:fs/promises";
import { finished } from "node:stream/promises";
import { Readable } from "node:stream";

import { config } from "./config.js";
import { StatusResponse } from "./status.js";

export async function downloadFile(url: URL, dstPath: string) {
  const srcRes = await fetch(url);
  if (!srcRes.body) {
    throw new Error(`Unable to download from URL ${url.toString()}`);
  }

  const fileStream = fs.createWriteStream(dstPath, { flags: "wx" });

  await finished(Readable.fromWeb(srcRes.body).pipe(fileStream));
}

export async function uploadFile(srcPath: string, dstUrl: URL) {
  const stats = await stat(srcPath);
  const fileSizeInBytes = stats.size;

  const readStream = fs.createReadStream(srcPath);
  const result = await fetch(dstUrl, {
    method: config.outputSubmitMethod,
    headers: { "Content-Length": `${fileSizeInBytes}` },
    duplex: "half",
    body: readStream,
  });

  if (!result.ok) {
    throw new Error(`Unable to upload to URL - ${dstUrl.toString()}`);
  }
}

export async function sendStatus(status: StatusResponse) {
  const resp = await fetch(config.statusReportUrl, {
    method: config.statusReportMethod,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(status),
  });

  if (!resp.ok) {
    const reason = await resp.text();

    throw new Error("Sending status has failed", { cause: reason });
  }
}
