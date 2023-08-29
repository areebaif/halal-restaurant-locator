import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import { PostAddStateZod } from "@/utils";
import { PostAddState, ResponseAddState } from "@/utils/types";

export default async function AddState(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddState>
) {
  try {
    const stateData = req.body;

    // state will be an array
    const isTypeCorrect = PostAddStateZod.safeParse(stateData);
    if (!isTypeCorrect.success) {
      res.json({
        typeError:
          "type check failed on the server, expected to recieve an objects with countryId property as string and stateName property as array of string",
      });
      return;
    }
    const typeCheckedStateData = stateData as PostAddState;
    const countryId = typeCheckedStateData.countryId;

    const countryExists = await prisma.country.findUnique({
      where: {
        countryId: countryId,
      },
    });
    if (!countryExists?.countryId) {
      res.json({
        country: "The provided countryId doesnot exist in the database",
      });
      return;
    }
    const mapStateData = typeCheckedStateData.stateName.map((state) => ({
      countryId: typeCheckedStateData.countryId,
      stateName: state,
    }));
    const createState = await prisma.state.createMany({
      data: mapStateData,
    });
    res.status(202).json({ created: "ok" });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      res.json({
        state:
          "There is a unique constraint violation, the combination of stateName and countryId already exist in the database or you have provided this combination twice",
      });
      return;
    }
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
