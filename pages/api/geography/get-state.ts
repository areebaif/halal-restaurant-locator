import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import {
  ReadCountriesDb,
  ReadStateDb,
  ResponseGetAllGeogByCountry,
} from "@/utils/types";

/**
 * @swagger
 * /api/geography/get-state:
 *  get:
 *    tags:
 *      - geolocations
 *    summary: get all states stored in the database
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
 */

export default async function GetAllCountries(
  req: NextApiRequest,
  res: NextApiResponse<ReadStateDb>
) {
  const country = await prisma.state.findMany({
    select: {
      countryId: true,
      stateId: true,
      stateName: true,
      Country: {
        select: { countryName: true },
      },
    },
    orderBy: {
      Country: {
        countryName: "asc",
      },
    },
  });
  if (!country.length) {
    return;
  }
  const states = country.map((item, index) => {
    return {
      countryId: item.countryId,
      countryName: item.Country.countryName,
      stateName: item.stateName,
      stateId: item.stateId,
      countryNameStateName: `${item.Country.countryName} - ${item.stateName}`,
    };
  });

  res.status(200).send(states);
}
