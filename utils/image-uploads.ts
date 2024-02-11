import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from ".";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export const S3ImagePreSignedUrl = (imageKey: string, imageType: string) => {
  // const command = new PutObjectCommand({
  //   Bucket: process.env.BUCKET_NAME,
  //   Key: imageKey,
  //   ContentType: imageType,
  // })

  // const preSignedUrl = getSignedUrl(s3Client, command, {
  //   expiresIn: 3600
  // })
  const Bucket = process.env.BUCKET_NAME!;
  const Fields = { key: imageKey };
  //   const Conditions = [
  //   { "bucket": Bucket},
  //   { key: imageKey! },
  //   [ "content-length-range", 1048576, 10485760 ], // file size limit 1KB-5MB
  //   [ "starts-with", "$Content-Type", "image/" ] // only support file of content-type: "image/jpg, image/png, image/gif"
  // ];
  // CONST {URL, FIELDS}

  const preSignedUrl = createPresignedPost(s3Client, {
    Bucket: Bucket,
    Key: imageKey,
    // Field: {dud: "hello!!!"} => this will add dud property to the fields returned by this function. I think it is sued to set optional metadata props to objects uploaded.
    Conditions: [
      ["content-length-range", 1024, 5242880],
      ["starts-with", "$Content-Type", "image/"],
      { key: imageKey },
      { bucket: Bucket },
    ],
    Expires: 300, // Seconds before the presigned post expires. 3600 by default.
  });
  return preSignedUrl;
};
