import fs from "node:fs";
import { stat } from "node:fs/promises";
import { finished } from "node:stream/promises";
import { Readable } from "node:stream";
import { OUTPUT_SUBMIT_METHOD } from "./config.js";

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
    method: OUTPUT_SUBMIT_METHOD,
    headers: { "Content-Length": `${fileSizeInBytes}` },
    duplex: "half",
    body: readStream,
  });

  if (!result.ok) {
    throw new Error(`Unable to upload to URL - ${dstUrl.toString()}`);
  }
}
