import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { prisma } from "@/db/prisma";
import { ResponseAddFoodTag } from "@/utils/types";
import { capitalizeFirstWord } from "@/utils";

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
