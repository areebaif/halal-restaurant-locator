import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { helperCreateUploadImageUrl, s3Client } from "@/utils";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { CreateUploadImageUrlZod } from "@/utils";
import {
  CreateUploadImageUrl,
  ListUploadImageUrl,
  ListUploadImageUrlError,
} from "@/utils/types";

// TODO: do return typing
/**
 * @swagger
 * /api/image:getUploadImageUrl:
 *  post:
 *    tags:
 *      - images
 *    summary: This is a custom route that gets a signed url from 3rd party api to upload images. This route also creates a restaurantId to tie images to restaurant.
 *    description: list of image urls
 *    operationId: listUploadImageUrl
 *    requestBody:
 *      description: The type and size of the images to be uploaded.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              restaurantId:
 *                type: string
 *                example: "8eb6525d-6fc5-429e-a1a4-cba290d0367a"
 *              cover:
 *                type: object
 *                properties:
 *                  type:
 *                    type: string
 *                    example: "image/png"
 *                  size:
 *                    type: number
 *                  dbUrl:
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
 *                    dbUrl:
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
 */

export default async function imageUpload(
  req: NextApiRequest,
  res: NextApiResponse<ListUploadImageUrl | ListUploadImageUrlError>
) {
  try {
    if (req.method === "POST") {
      console.log(" I am here", req.body.image);
      const images = req.body.image as CreateUploadImageUrl;

      // do zod typechecking here
      const isTypeCorrent = CreateUploadImageUrlZod.safeParse(images);
      if (!isTypeCorrent.success) {
        console.log(isTypeCorrent.error);
        const schemaErrors = isTypeCorrent.error.flatten().fieldErrors;
        let errors: string[] = [];
        if (schemaErrors.cover?.length) {
          errors = [...schemaErrors.cover];
        }
        if (schemaErrors.otherImages?.length) {
          errors = [...schemaErrors.otherImages];
        }
        res.status(404).send({
          apiErrors: {
            validationErrors: { images: errors },
          },
        });
        return;
      }

      // create a restaurantId since it will be part of url to be uploaded to 3rd party service
      const restaurantId = uuidv4();
      const imageUrl: { key: string; type: string; dbUrl: string }[] = [];
      const stringArray = images.cover.type.split("/");
      const imageExtension = stringArray[1];
      const coverDbUrl = `${restaurantId}/cover/${uuidv4()}`;
      imageUrl.push({
        key: `${coverDbUrl}.${imageExtension}`,
        type: images.cover.type,
        dbUrl: coverDbUrl,
      });
      images.otherImages.forEach((file) => {
        if (file) {
          const stringArray = file.type.split("/");
          const imageExtension = stringArray[1];
          const dbUrl = `${restaurantId}/${uuidv4()}`;
          imageUrl.push({
            key: `${dbUrl}.${imageExtension}`,
            type: file?.type,
            dbUrl: dbUrl,
          });
        }
      });

      const imagePromises = imageUrl.map((image) =>
        helperCreateUploadImageUrl(image.key)
      );
      const listUploadImageUrl = await Promise.all(imagePromises);

      const preSignedUrl = {
        restaurantId: restaurantId,
        cover: {
          uploadS3Url: listUploadImageUrl[0].url,
          uploadS3Fields: listUploadImageUrl[0].fields,
          type: imageUrl[0].type,
          dbUrl: imageUrl[0].dbUrl,
        },
        otherImages:
          listUploadImageUrl.length > 1
            ? images.otherImages.map((image, index) => ({
                uploadS3Url: listUploadImageUrl[index + 1].url,
                uploadS3Fields: listUploadImageUrl[index + 1].fields,
                type: imageUrl[index + 1]?.type!,
                dbUrl: imageUrl[index + 1].dbUrl,
              }))
            : undefined,
      };
      res.status(201).json(preSignedUrl);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      apiErrors: {
        generalErrors: ["somethong went wrong, please try again"],
      },
    });
  }
}
