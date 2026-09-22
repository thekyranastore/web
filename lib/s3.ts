import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint,
  forcePathStyle: !!endpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucket = process.env.AWS_S3_BUCKET!;

export async function createPresignedUpload(contentType: string, folder: string) {
  const extension = contentType.split("/")[1] ?? "bin";
  const key = `${folder}/${randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  const publicUrl = endpoint
    ? `${endpoint}/${bucket}/${key}`
    : `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl, key };
}
