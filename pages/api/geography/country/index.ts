import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";
// local imports
import { ReadCountriesDb, ResponseAddCountry } from "@/utils/types";
import { capitalizeFirstWord } from "@/utils";

/**
 * @swagger
 * /api/geography/country:
 *  post:
 *    tags:
 *      - geolocations
 *    summary: create a new country
 *    description: add a country to the database.
 *    operationId: createCountry
 *    requestBody:
 *      description: add country name in the database.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Country'
 *
 *      required: true
 *    responses:
 *      '201':
 *        description: Successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  example: "8eb6525d-6fc5-429e-a1a4-cba290d0367a"
 *      '400':
 *        description: Invalid data supplied
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                country:
 *                  type: string
 *                  example: "country value already exists, please provide a unique name"
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

export default async function AddCountry(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddCountry | ReadCountriesDb>
) {
  try {
    if (req.method === "POST") {
      const country = req.body.country;
      if (typeof country !== "string" || !country.length) {
        res
          .status(400)
          .json({ country: "please provide valid value for country" });
        return;
      }
      const countryString = country as string;
      const countryName = capitalizeFirstWord(countryString);
      const countryExists = await prisma.country.findUnique({
        where: {
          countryName: countryName,
        },
      });
      if (countryExists?.countryId) {
        res.status(400).json({
          country: "country value already exists, please provide a unique name",
        });
        return;
      }
      const createCountry = await prisma.country.create({
        data: {
          countryName: countryName,
        },
      });
      res.status(201).json({ id: createCountry.countryId });
    }
    if (req.method === "GET") {
      const country = await prisma.country.findMany({
        select: { countryId: true, countryName: true },
      });
      res.status(200).send({
        countries: country,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
