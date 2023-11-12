import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import {
  PostAddZipcodeZod,
  countryIdExists,
  stateIdExists,
  cityIdExists,
} from "@/utils";
import {
  ResponseAddZipcode,
  PostAddZipcode,
  ReadZipcodeDb,
} from "@/utils/types";

/**
 * @swagger
 * /api/geography/zipcode:
 *  post:
 *    tags:
 *      - geolocations
 *    summary: create zipcode
 *    description: add zipcode to the database.
 *    operationId: createZipcode
 *    requestBody:
 *      description: add zipcode to an exisiting country, state and city in the database.
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                countryId:
 *                  type: string
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                stateId:
 *                  type: string
 *                  format: uuid
 *                  example:  "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                cityId:
 *                  type: string
 *                  format: uuid
 *                  example:  "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                countryStateCityName:
 *                  type: string
 *                  example: U.S.A - Minnesota - Minneapolis
 *                zipcode:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      latitude:
 *                        type: number
 *                        format: float
 *                        example: 45.04856
 *                      longitude:
 *                        type: number
 *                        format: float
 *                        example: -93.4269,
 *                      zipcode:
 *                        type: string
 *                        example: "55442"
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
 *                  example:  "type check failed on the server, expected to recieve array of objects with countryId, stateName, cityName properties as string and zipcode property as array of object with latitude , longitude properties as number and zipcode as string"
 *                country:
 *                  type: string
 *                  example: "The provided countryId doesnot exist in the database"
 *                state:
 *                  type: string
 *                  example: "The provided stateName in reference to countryId doesnot exist in the database"
 *                city:
 *                  type: string
 *                  example:  "The provided cityName in reference to countryId and stateName doesnot exist in the database"
 *                zipcode:
 *                  type: string
 *                  example:  "There is a unique constraint violation, the combination of zipcode, cityName, stateName and countryId already exist in the database or you have provided this combination more than once"
 *  get:
 *    tags:
 *      - geolocations
 *    summary: get all zipcodes stored in the database
 *    description: Returns an array of objects containing state names and state id
 *    operationId: getAllZipcode
 *    responses:
 *      '200':
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      countryId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      countryName:
 *                        type: string
 *                        example: "U.S.A"
 *                      stateId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      stateName:
 *                        type: string
 *                        example: "Minnesota"
 *                      countryStateCityZipcode:
 *                        type: string
 *                        example: "U.S.A - Minnesota - Minneapolis - 55443"
 *                      cityId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      cityName:
 *                        type: string
 *                        example: "Minneapolis"
 *                      zipcodeId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      zipcode:
 *                        type: string
 *                        example: "55433"
 */

export default async function AddState(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddZipcode | ReadZipcodeDb>
) {
  try {
    if (req.method === "POST") {
      const zipcodeData = req.body;
      const isTypeCorrect = PostAddZipcodeZod.safeParse(zipcodeData);
      if (!isTypeCorrect.success) {
        console.log(isTypeCorrect.error);
        res.status(400).json({
          typeError:
            "type check failed on the server, expected to recieve array of objects with countryId, stateName, cityName properties as string and zipcode property as array of object with latitude , longitude properties as number and zipcode as string",
        });
        return;
      }
      const parsedZipcodeData = zipcodeData as PostAddZipcode;
      const countryNotFound = await countryIdExists(parsedZipcodeData);
      const stateNotFound = await stateIdExists(parsedZipcodeData);
      const cityNotFound = await cityIdExists(parsedZipcodeData);

      if (countryNotFound) {
        res.status(400).json({
          country: "The provided countryId doesnot exist in the database",
        });
        return;
      }

      if (stateNotFound) {
        res.status(400).json({
          state: "The provided stateId doesnot exist in the database",
        });
        return;
      }
      if (cityNotFound) {
        res.status(400).json({
          city: "The provided cityId doesnot exist in the database",
        });
        return;
      }
      const allZipcode: {
        countryId: string;
        stateId: string;
        cityId: string;
        zipcode: string;
        latitude: number;
        longitude: number;
      }[] = [];

      parsedZipcodeData.forEach((zipcodeItem) => {
        zipcodeItem.zipcode.forEach((item) => {
          const mappedData = {
            countryId: zipcodeItem.countryId,
            stateId: zipcodeItem.stateId,
            cityId: zipcodeItem.cityId,
            latitude: item.latitude,
            longitude: item.longitude,
            zipcode: item.zipcode,
          };
          allZipcode.push(mappedData);
        });
      });
      const createZipcode = await prisma.zipcode.createMany({
        data: allZipcode,
      });
      res.status(201).json({ created: "ok" });
    }
    if (req.method === "GET") {
      const zipcode = await prisma.zipcode.findMany({
        select: {
          countryId: true,
          stateId: true,
          cityId: true,
          zipcode: true,
          zipcodeId: true,
          latitude: true,
          longitude: true,
          Country: {
            select: { countryName: true },
          },
          State: { select: { stateName: true } },
          City: { select: { cityName: true } },
        },
        orderBy: [
          {
            Country: {
              countryName: "asc",
            },
          },
          {
            State: {
              stateName: "asc",
            },
          },
          {
            City: {
              cityName: "asc",
            },
          },
        ],
      });
      if (!zipcode.length) {
        // there is no data to send
        res.status(200).send([]);
        return;
      }
      const zipcodes = zipcode.map((item) => {
        return {
          countryId: item.countryId,
          countryName: item.Country.countryName,
          stateId: item.stateId,
          stateName: item.State.stateName,
          cityId: item.cityId,
          cityName: item.City.cityName,
          zipcode: item.zipcode,
          zipcodeId: item.zipcodeId,
          // TODO: not sure if i need latitude & longitude yet
          latitude: item.latitude,
          longitude: item.longitude,
          countryStateCityZipcode: `${item.Country.countryName} - ${item.State.stateName} - ${item.City.cityName} - ${item.zipcode}`,
        };
      });

      res.status(200).send(zipcodes);
    }
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
