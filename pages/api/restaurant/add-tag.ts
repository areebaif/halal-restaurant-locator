import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { prisma } from "@/db/prisma";
import { ResponseAddFoodTag } from "@/utils/types";

export default async function FoodTag(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddFoodTag>
) {
  try {
    const foodTag = req.body.foodTag;

    if (typeof foodTag !== "string" || !foodTag.length) {
      res.json({ foodTag: "please provide valid value for food tag" });
      return;
    }
    const tag = foodTag as string;

    const foodTagExists = await prisma.foodTag.findUnique({
      where: {
        name: tag,
      },
    });
    if (foodTagExists?.foodTagId) {
      res.json({
        foodTag: "food tag value already exists, please provide a unique name",
      });
      return;
    }

    const createFoodTag = await prisma.foodTag.create({
      data: {
        name: foodTag,
      },
    });

    res.status(202).json({ id: createFoodTag.foodTagId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ foodTag: "something went wrong with the server" });
  }
}
