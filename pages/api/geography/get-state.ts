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
 *              type: object
 *              properties:
 *                state:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      stateId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      stateName:
 *                        type: string
 *                        example: "U.S.A"
 */

// TODO: fix api docs
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
  });
  const mappedStates = country.map((item) => ({
    countryId: item.countryId,
    stateId: item.stateId,
    stateName: item.stateName,
    countryName: item.Country.countryName,
  }));
  res.status(200).send(mappedStates);
}
