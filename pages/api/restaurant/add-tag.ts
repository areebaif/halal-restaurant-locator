import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function FoodTag(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const body = JSON.parse(req.body);
    const foodTag = body.foodTag;

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
    if (foodTagExists?.id) {
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

    res.status(202).json({ name: createFoodTag.id });
  } catch (err) {
    res.status(500).json({ foodTag: "something went wrong with the server" });
  }
}
