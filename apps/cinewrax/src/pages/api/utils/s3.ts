import { S3Client } from "@aws-sdk/client-s3";

export function createS3Client(awsAccessKeyId: string, awsSecretAccessKey: string, awsRegion: string) {
  return new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });
}

export function makeInputFileUploadPath(sessionId: string, transcodingId: string, fileId: string, filename: string) {
  return `${sessionId}/${transcodingId}/${fileId}/input/${filename}`;
}

export function makeOutputFileUploadPath(sessionId: string, transcodingId: string, fileId: string, filename: string) {
  return `${sessionId}/${transcodingId}/${fileId}/output/${filename}`;
}
