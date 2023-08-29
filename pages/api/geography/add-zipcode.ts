import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { PostAddZipCodeZod } from "@/utils";
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
      res.json({
        typeError:
          "type check failed on the server, expected to recieve array of objects with countryId, stateId, cityId properties as string and zipcode property as array of object with latitude , longitude properties as number and zipcode as string",
      });
      return;
    }
    const parsedZipcodeData = zipcodeData as PostAddZipCode;
    const countryId = parsedZipcodeData.countryId;
    const stateId = parsedZipcodeData.stateId;
    const cityId = parsedZipcodeData.cityId;
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
    const cityExists = await prisma.city.findUnique({
      where: {
        countryId: countryId,
        stateId: stateId,
        cityId: cityId,
      },
    });
    if (!cityExists?.cityId) {
      res.json({
        city: "The provided cityId in reference to countryId and stateId doesnot exist in the database",
      });
      return;
    }
    const mapZipcodeData = parsedZipcodeData.zipcode.map((zipcodeItem) => ({
      countryId: parsedZipcodeData.countryId,
      stateId: parsedZipcodeData.stateId,
      cityId: parsedZipcodeData.cityId,
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
      res.json({
        zipcode:
          "There is a unique constraint violation, the combination of zipcode, cityId, stateId and countryId already exist in the database or you have provided this combination more than once",
      });
      return;
    }
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
