import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { uploadToS3 } from "@/utils";
import { v4 as uuidv4 } from "uuid";


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
 *              foodTag:
 *                type: string
 *                example: "vegetarian"
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
 *      - restaurants
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
  res: NextApiResponse
) {
  try {
  // restaurantId/cover/ImageId
  // {cover: {imageId, imageType, imageSize},}

    if (req.method === "POST") {
      const imageId = req.body.image;
      console.log(imageId)
      res.status(201).json({  });
    }
   
  } catch (err) {
    console.log(err);
    res.status(500).json({ foodTag: "something went wrong with the server" });
  }
}
