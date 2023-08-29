import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { PostAddCityZod } from "@/utils";
import { ResponseAddCity, PostAddCity } from "@/utils/types";

export default async function AddState(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddCity>
) {
  try {
    const cityData = req.body;
    const isTypeCorrect = PostAddCityZod.safeParse(cityData);
    if (!isTypeCorrect.success) {
      res.json({
        typeError:
          "type check failed on the server, expected to recieve array of objects with countryId, stateId properties as string and cityName property as array of string",
      });
      return;
    }
    const parsedCityData = cityData as PostAddCity;
    const countryId = parsedCityData.countryId;
    const stateId = parsedCityData.stateId;
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
    const stateExists = await prisma.state.findUnique({
      where: {
        countryId: countryId,
        stateId: stateId,
      },
    });
    if (!stateExists?.stateId) {
      res.json({
        state:
          "The provided stateId inreference to countryId doesnot exist in the database",
      });
      return;
    }
    const mapCityData = parsedCityData.cityName.map((city) => ({
      countryId: parsedCityData.countryId,
      stateId: parsedCityData.stateId,
      cityName: city,
    }));
    const createCity = await prisma.city.createMany({
      data: mapCityData,
    });
    res.status(202).json({ created: "ok" });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      res.json({
        city: "There is a unique constraint violation, the combination of cityName, stateId and countryId already exist in the database or you have provided this combination more than once",
      });
      return;
    }
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
