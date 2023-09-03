import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { PostAddCityZod, capitalizeFirstWord } from "@/utils";
import { ResponseAddCity, PostAddCity } from "@/utils/types";

/**
 * @swagger
 * /api/geography/add-city:
 *  post:
 *    tags:
 *      - geolocations
 *    summary: create multiple cities
 *    description: add multiple cities to the database.
 *    operationId: createCity
 *    requestBody:
 *      description: add multiple cities to an exisiting country and state in the database.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              countryId:
 *                type: string
 *                format: uuid
 *                example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *              stateName:
 *                type: string
 *                example: Minnesota
 *              cityName:
 *                type: string
 *                example: ["Minneapolis", "Chicago"]
 *        
 *      required: true
 *    responses:
 *      '201':
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              schema:
 *              type: object
 *              properties:
 *                created:
 *                  type: string
 *                  example: "ok"          
 *      '400':
 *        description: Invalid data supplied
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                typeError:
 *                  type: string
 *                  example: "type check failed on the server, expected to recieve array of objects with countryId, stateName properties as string and cityName property as array of string"
 *                country:
 *                  type: string
 *                  example: "The provided countryId doesnot exist in the database"
 *                state:
 *                  type: string
 *                  example: "The provided stateName in reference to countryId doesnot exist in the database"
 *                city:
 *                  type: string
 *                  example: "There is a unique constraint violation, the combination of cityName, stateName and countryId already exist in the database or you have provided this combination more than once"
 
*/

export default async function AddState(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddCity>
) {
  try {
    const cityData = req.body;
    const isTypeCorrect = PostAddCityZod.safeParse(cityData);
    if (!isTypeCorrect.success) {
      console.log(isTypeCorrect.error);
      res.status(400).json({
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
      res.status(400).json({
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
      res.status(400).json({
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
    res.status(201).json({ created: "ok" });
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