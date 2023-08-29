import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";
// local imports
import { ResponseAddCountry } from "@/utils/types";
import { capitalizeFirstWord } from "@/utils";
export default async function AddCountry(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddCountry>
) {
  try {
    const country = req.body.country;
    if (typeof country !== "string" || !country.length) {
      res.json({ country: "please provide valid value for country" });
      return;
    }
    const countryString = country as string;
    const countryName = capitalizeFirstWord(countryString);
    const countryExists = await prisma.country.findUnique({
      where: {
        countryName: countryName,
      },
    });
    if (countryExists?.countryId) {
      res.json({
        country: "country value already exists, please provide a unique name",
      });
      return;
    }
    const createCountry = await prisma.country.create({
      data: {
        countryName: countryName,
      },
    });
    res.status(202).json({ id: createCountry.countryId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
