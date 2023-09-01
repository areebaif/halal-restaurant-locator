import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { prisma } from "@/db/prisma";
import { ResponseAddFoodTag } from "@/utils/types";
import { capitalizeFirstWord } from "@/utils";

/**
 * @swagger
 * /api/restaurant/add-tag:
 *     post:
 *       tags:
 *         - restaurants
 *       summary: create a new food tag
 *       description: add a food tag to the database.
 *       operationId: createTag
 *       requestBody:
 *         description: add a food tag in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 foodTag:
 *                   type: string
 *                   example: "vegetarian"
 *         required: true
 *       responses:
 *         '201':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "8eb6525d-6fc5-429e-a1a4-cba290d0367a"
 *         '400':
 *           description: Invalid data supplied
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                    foodTag:
 *                     type: string
 *                     example: "food tag value already exists, please provide a unique name"
 *
 *
 */

export default async function FoodTag(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddFoodTag>
) {
  try {
    const foodTag = req.body.foodTag;

    if (typeof foodTag !== "string" || !foodTag.length) {
      res
        .status(400)
        .json({ foodTag: "please provide valid value for food tag" });
      return;
    }
    const tag = foodTag as string;
    const sanitizeTag = capitalizeFirstWord(tag);

    const foodTagExists = await prisma.foodTag.findUnique({
      where: {
        name: sanitizeTag,
      },
    });
    if (foodTagExists?.foodTagId) {
      res.status(400).json({
        foodTag: "food tag value already exists, please provide a unique name",
      });
      return;
    }

    const createFoodTag = await prisma.foodTag.create({
      data: {
        name: sanitizeTag,
      },
    });

    res.status(201).json({ id: createFoodTag.foodTagId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ foodTag: "something went wrong with the server" });
  }
}
