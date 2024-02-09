import {  PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from '.';

const S3ImagePreSignedUrl = ( imageKey: string, imageType: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: imageKey,
    ContentType: imageType,
  })

  const preSignedUrl = getSignedUrl(s3Client, command, {
    expiresIn: 3600
  })
  
  return preSignedUrl
};

export const uploadToS3 = (imageKey: string, imageType: string) => {
  const imagePromises = [];
  imagePromises.push(S3ImagePreSignedUrl(imageKey, imageType))
  return imagePromises
}
