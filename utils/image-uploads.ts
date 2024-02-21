import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from ".";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export const s3ImagePreSignedUrl = (imageKey: string, imageType: string) => {
  // This is preSignedGet
  // const command = new PutObjectCommand({
  //   Bucket: process.env.BUCKET_NAME,
  //   Key: imageKey,
  //   ContentType: imageType,
  // })

  // const preSignedUrl = getSignedUrl(s3Client, command, {
  //   expiresIn: 3600
  // })

  // Get ObjectMetadata
  // const command = new HeadObjectCommand({
  //   Bucket: process.env.BUCKET_NAME!,
  //   Key: "7f0c1efe-4eda-44fc-a0c2-a0606d6755a7/cover/3750f429-0d9a-4250-85f1-fbb31690b822.png",
  // });
  // const testre = await s3Client.send(command);
  const Bucket = process.env.BUCKET_NAME!;

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
