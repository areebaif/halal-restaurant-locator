import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { PostAddZipCodeZod, capitalizeFirstWord } from "@/utils";
import { ResponseAddZipCode, PostAddZipCode } from "@/utils/types";

export default async function AddState(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddZipCode>
) {
  try {
    const zipcodeData = req.body;
    console.log(zipcodeData, "sjsjsjsjs");
    const isTypeCorrect = PostAddZipCodeZod.safeParse(zipcodeData);
    if (!isTypeCorrect.success) {
      console.log(isTypeCorrect.error);
      res.json({
        typeError:
          "type check failed on the server, expected to recieve array of objects with countryId, stateName, cityName properties as string and zipcode property as array of object with latitude , longitude properties as number and zipcode as string",
      });
      return;
    }
    const parsedZipcodeData = zipcodeData as PostAddZipCode;
    const countryId = parsedZipcodeData.countryId;
    const stateName = capitalizeFirstWord(parsedZipcodeData.stateName);
    const cityName = capitalizeFirstWord(parsedZipcodeData.cityName);
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
        countryId_stateName: {
          countryId: countryExists?.countryId,
          stateName: stateName,
        },
      },
    });
    if (!stateExists?.stateId) {
      res.json({
        state:
          "The provided stateName inreference to countryId doesnot exist in the database",
      });
      return;
    }
    const cityExists = await prisma.city.findUnique({
      where: {
        countryId_stateId_cityName: {
          countryId: countryExists.countryId,
          stateId: stateExists.stateId,
          cityName: cityName,
        },
      },
    });
    if (!cityExists?.cityId) {
      res.json({
        city: "The provided cityName in reference to countryId and stateName doesnot exist in the database",
      });
      return;
    }
    const mapZipcodeData = parsedZipcodeData.zipcode.map((zipcodeItem) => ({
      countryId: countryExists.countryId,
      stateId: stateExists.stateId,
      cityId: cityExists.cityId,
      latitude: zipcodeItem.latitude,
      longitude: zipcodeItem.longitude,
      zipcode: zipcodeItem.zipcode,
    }));
    const createZipcode = await prisma.zipcode.createMany({
      data: mapZipcodeData,
    });
    res.status(202).json({ created: "ok" });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.json({
          zipcode:
            "There is a unique constraint violation, the combination of zipcode, cityName, stateName and countryId already exist in the database or you have provided this combination more than once",
        });
        return;
      }
    }
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
