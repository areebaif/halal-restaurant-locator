import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { ReadFoodTagsDb } from "@/utils/types";

/**
 * @swagger
 * /api/geography/get-food-tags:
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

export default async function GetFoodTags(
  req: NextApiRequest,
  res: NextApiResponse<ReadFoodTagsDb>
) {
  // get zipcode
  const foodTags = await prisma.foodTag.findMany({
    select: { name: true, foodTagId: true },
  });

  res.status(200).send(foodTags);
}
