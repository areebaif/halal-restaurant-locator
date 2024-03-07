import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { prisma } from "@/db/prisma";
import {
  CreateFoodTag,
  ListFoodTags,
  CreateFoodTagErrors,
  ListFoodTagsError,
} from "@/utils/types";
import { capitalizeFirstWord } from "@/utils";

/**
 * @swagger
 * /api/foodtags:
 *  post:
 *    tags:
 *      - foodtags
 *    summary: upsert foodtag
 *    description: create foodtags or update food tags if they exist in the database.
 *    operationId: createFoodtag
 *    requestBody:
 *      description: list of foodtags to add to the database.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              foodTag:
 *                type: array
 *                items:
 *                  type: string
 *                  example: "vegetarian, Indian"
 *      required: true
 *    responses:
 *      '201':
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                created:
 *                  type: boolean
 *                  example: true
 *      '400':
 *        description: Invalid data supplied
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  apiErrors:
 *                    type: object
 *                    properties:
 *                      validationErrors:
 *                        type: object
 *                        properties:
 *                          foodtag:
 *                            type: array
 *                            items:
 *                              type: string
 *                              example: "please provide valid value for food tag"
 *      '500':
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  apiErrors:
 *                    type: object
 *                    properties:
 *                      generalErrors:
 *                        type: array
 *                        items:
 *                          type: string
 *                          example: "something went wrong with the server"
 *
 *  get:
 *    tags:
 *      - foodtags
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
 *      '500':
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  apiErrors:
 *                    type: object
 *                    properties:
 *                      generalErrors:
 *                        type: array
 *                        items:
 *                          type: string
 *                          example: "something went wrong with the server"
 */
export default async function FoodTag(
  req: NextApiRequest,
  res: NextApiResponse<
    CreateFoodTag | CreateFoodTagErrors | ListFoodTags | ListFoodTagsError
  >
) {
  try {
    if (req.method === "POST") {
      const foodTag = req.body.foodTag;
      if (!foodTag.length || !Array.isArray(foodTag)) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              foodTag: ["please provide valid value for food tags"],
            },
          },
        });
        return;
      }
      const tags = foodTag as string[];
      const santizeListTags = tags.map((tag) => capitalizeFirstWord(tag));

      const foodTagsPromise = santizeListTags.map((tag) =>
        prisma.foodTag.findUnique({
          where: {
            name: tag,
          },
        })
      );
      const listFoodTagExists = await Promise.all(foodTagsPromise);

      const foodTagsToCreate: { name: string }[] = [];
      listFoodTagExists.forEach((tag, index) => {
        if (!tag?.foodTagId) {
          foodTagsToCreate.push({ name: santizeListTags[index] });
        }
      });

      await prisma.foodTag.createMany({
        data: foodTagsToCreate,
        skipDuplicates: true,
      });

      res.status(201).json({ created: true });
    }
    if (req.method === "GET") {
      const foodTags = await prisma.foodTag.findMany({
        select: { name: true, foodTagId: true },
      });
      res.status(200).send(foodTags);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      apiErrors: { generalErrors: ["something went wrong with the server"] },
    });
  }
}
