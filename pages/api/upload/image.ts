import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { s3ImagePreSignedUrl, s3Client } from "@/utils";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { PostImageSignedUrlZod } from "@/utils";
import { PostImageSignedUrl, ResponsePostSignedUrl } from "@/utils/types";

// TODO: do return typing
/**
 * @swagger
 * /api/image-upload:
 *  post:
 *    tags:
 *      - images
 *    summary: image upload route
 *    description: get a pre signed url to upload image to aws
 *    operationId: imageUpload
 *    requestBody:
 *      description: request pre-signed urls to upload images to aws.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              cover:
 *                type: object
 *                properties:
 *                  type:
 *                    type: string
 *                    example: "image/png"
 *                  size:
 *                    type: number
 *                  url:
 *                    type: string
 *              otherImages:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    type:
 *                      type: string
 *                      example: "image/png"
 *                    size:
 *                      type: number
 *                    url:
 *                      type: string
 *      required: true
 *    responses:
 *      '201':
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  example: "8eb6525d-6fc5-429e-a1a4-cba290d0367a"
 *      '400':
 *        description: Invalid data supplied
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                 foodTag:
 *                  type: string
 *                  example: "food tag value already exists, please provide a unique name"
 *  get:
 *    tags:
 *      - images
 *    summary: get all food tags stored in the database
 *    description: Returns an array of objects containing food tag name and tag id
 *    operationId: get all food tags
 *    responses:
 *      '200':
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      foodTagId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      name:
 *                        type: string
 *                        example: "Vegetarian"
 */

export default async function imageUpload(
  req: NextApiRequest,
  res: NextApiResponse<ResponsePostSignedUrl>
) {
  try {
    if (req.method === "POST") {
      const images = req.body.image as PostImageSignedUrl;

      // do zod typechecking here
      const isTypeCorrent = PostImageSignedUrlZod.safeParse(images);
      if (!isTypeCorrent.success) {
        console.log(isTypeCorrent.error);
        const schemaErrors = isTypeCorrent.error.flatten().fieldErrors;

        res.status(404).send({
          coverImage: schemaErrors.cover,
          images: schemaErrors.otherImages,
        });
        return;
      }

      const stringArray = images.cover.type.split("/");
      const imageExtension = stringArray[1];
      const coverImageKey = `${images.cover.url}.${imageExtension}`;

      // Array is a collection in which insertion order is preserved. Hence, we are inserting cover image into imageUrl first, then other images.
      // We will need this sort order once we have the preSigned post url from s3. The first url in the array will correspond to cover image and so on...
      // Think of this array as tuple!!!!
      const imageUrl = [{ key: coverImageKey, type: images.cover.type }];
      images.otherImages.forEach((image) => {
        if (image) {
          const stringArray = image.type.split("/");
          const imageExtension = stringArray[1];
          imageUrl.push({
            key: `${image?.url}.${imageExtension}`,
            type: image.type,
          });
        }
      });

      const imagePromises = imageUrl.map((image) =>
        s3ImagePreSignedUrl(image.key, image.type)
      );
      const preSignedUrlArr = await Promise.all(imagePromises);

      const preSignedUrl = {
        cover: {
          uploadS3Url: preSignedUrlArr[0].url,
          uploadS3Fields: preSignedUrlArr[0].fields,
          type: images.cover.type,
          dbUrl: images.cover.url,
        },
        otherImages:
          preSignedUrlArr.length > 1
            ? images.otherImages.map((image, index) => ({
                uploadS3Url: preSignedUrlArr[index + 1].url,
                uploadS3Fields: preSignedUrlArr[index + 1].fields,
                type: images.otherImages[index]?.type!,
                dbUrl: images.otherImages[index + 1]?.url!,
              }))
            : undefined,
      };
      res.status(201).json(preSignedUrl);
    }
  } catch (err) {
    console.log(err);

    // TODO: error handling for aws s3. Check its error codes
    //res.status(500).json({ });
  }
}
