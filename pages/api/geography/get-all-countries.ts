import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { ReadCountriesDb, ResponseGetAllGeogByCountry } from "@/utils/types";

/**
 * @swagger
 * /api/geography/get-all-countries:
 *  get:
 *    tags:
 *      - geolocations
 *    summary: get all countries stored in the database
 *    description: Returns an array of objects containing countryId and countryName
 *    operationId: getAllGeographyByCountry
 *    responses:
 *      '200':
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                countries:
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
 */

export default async function GetAllCountries(
  req: NextApiRequest,
  res: NextApiResponse<ReadCountriesDb>
) {
  const country = await prisma.country.findMany({
    select: { countryId: true, countryName: true },
  });
  res.status(200).send({
    countries: country,
  });
}
