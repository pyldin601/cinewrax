import { NextApiRequest, NextApiResponse } from "next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

import { createS3Client, makeInputFileUploadPath } from "./utils/s3";
import { getEnv } from "./utils/env";

const awsRegion = getEnv("AWS_REGION");
const awsAccessKeyId = getEnv("AWS_ACCESS_KEY_ID");
const awsSecretAccessKey = getEnv("AWS_SECRET_ACCESS_KEY");
const awsS3BucketName = getEnv("AWS_S3_BUCKET_NAME");

const s3Client = createS3Client(awsAccessKeyId, awsSecretAccessKey, awsRegion);

const INPUT_FILE_OBJECT_TTL_SECONDS = 60 * 60 * 24; // 24 hours
const INPUT_FILE_PRE_SIGNED_URL_TTL = 60 * 60; // 1 hour

const RequestBodySchema = z.object({
  // Session
  sessionId: z.string(),
  transcodingId: z.string(),
  fileId: z.string(),
  // File
  filename: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId, transcodingId, fileId, filename } = RequestBodySchema.parse(req.body);
  const path = makeInputFileUploadPath(sessionId, transcodingId, fileId, filename);

  // TODO: Store metadata with original file name, file size, etc...

  const command = new PutObjectCommand({
    Key: path,
    Bucket: awsS3BucketName,
    Expires: new Date(Date.now() + INPUT_FILE_OBJECT_TTL_SECONDS * 1000),
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: INPUT_FILE_PRE_SIGNED_URL_TTL,
  });

  res.json({ path, url });
}
