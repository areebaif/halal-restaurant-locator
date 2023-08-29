import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { PostAddCityZod, capitalizeFirstWord } from "@/utils";
import { ResponseAddCity, PostAddCity } from "@/utils/types";

export default async function AddState(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddCity>
) {
  try {
    const cityData = req.body;
    const isTypeCorrect = PostAddCityZod.safeParse(cityData);
    if (!isTypeCorrect.success) {
      console.log(isTypeCorrect.error);
      res.json({
        typeError:
          "type check failed on the server, expected to recieve array of objects with countryId, stateName properties as string and cityName property as array of string",
      });
      return;
    }
    const parsedCityData = cityData as PostAddCity;
    const countryId = parsedCityData.countryId;
    const stateName = capitalizeFirstWord(parsedCityData.stateName);
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
    const stateExists = await prisma.state.findMany({
      where: {
        countryId: countryExists.countryId,
        stateName: stateName,
      },
    });
    if (!stateExists?.[0].stateId) {
      res.json({
        state:
          "The provided stateName in reference to countryId doesnot exist in the database",
      });
      return;
    }
    const mapCityData = parsedCityData.cityName.map((city) => ({
      countryId: countryExists.countryId,
      stateId: stateExists[0].stateId,
      cityName: capitalizeFirstWord(city),
    }));
    const createCity = await prisma.city.createMany({
      data: mapCityData,
    });
    res.status(202).json({ created: "ok" });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.json({
          city: "There is a unique constraint violation, the combination of cityName, stateName and countryId already exist in the database or you have provided this combination more than once",
        });
        return;
      }
    }
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
