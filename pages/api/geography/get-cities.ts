import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

import { ReadCityDb, ReadStateDb } from "@/utils/types";

/**
 * @swagger
 * /api/geography/get-cities:
 *  get:
 *    tags:
 *      - geolocations
 *    summary: get all cities stored in the database
 *    description: Returns an array of objects containing state names and state id
 *    operationId: getAllState
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
 *                      countryStateCityName:
 *                        type: string
 *                        example: "U.S.A - Minnesota - Minneapolis"
 *                      cityId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      cityName:
 *                        type: string
 *                        example: "Minneapolis"
 */

export default async function GetAllCities(
  req: NextApiRequest,
  res: NextApiResponse<ReadCityDb>
) {
  const city = await prisma.city.findMany({
    select: {
      countryId: true,
      stateId: true,
      cityId: true,
      cityName: true,
      Country: {
        select: { countryName: true },
      },
      State: { select: { stateName: true } },
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
      { cityName: "asc" },
    ],
  });
  if (!city.length) {
    // there is no data to send
    res.status(200).send([]);
    return;
  }
  const cities = city.map((item) => {
    return {
      countryId: item.countryId,
      countryName: item.Country.countryName,
      stateId: item.stateId,
      stateName: item.State.stateName,
      cityId: item.cityId,
      cityName: item.cityName,
      countryStateCityName: `${item.Country.countryName} - ${item.State.stateName} - ${item.cityName}`,
    };
  });

  res.status(200).send(cities);
}
