import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { ReadZipcodeDb } from "@/utils/types";

/**
 * @swagger
 * /api/geography/get-zipcode:
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

export default async function GetAllZipcode(
  req: NextApiRequest,
  res: NextApiResponse<ReadZipcodeDb>
) {
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
