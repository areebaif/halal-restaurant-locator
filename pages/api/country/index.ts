import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";
// local imports
import {
  ListCountries,
  CreateCountryResponse,
  CreateCountryError,
} from "@/utils/types";
import { capitalizeFirstWord } from "@/utils";

/**
 * @swagger
 * /api/country:
 *  post:
 *    tags:
 *      - country
 *    summary: create a new country
 *    description: add a country to the database.
 *    operationId: createCountry
 *    requestBody:
 *      description: add country name in the database.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              country:
 *                type: string
 *                example: U.S.A
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
 *                country:
 *                  type: string
 *                  example: U.S.A
 *      '400':
 *        description: Invalid data supplied
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  apiErrors:
 *                    type: object
 *                    properties:
 *                      validationErrors:
 *                        type: object
 *                        properties:
 *                          country:
 *                            type: array
 *                            items:
 *                              type: string
 *                              example: "please provide valid value for country"
 *      '500':
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  apiErrors:
 *                    type: object
 *                    properties:
 *                      generalErrors:
 *                        type: array
 *                        items:
 *                          type: string
 *                          example: "something went wrong with the server"
 *
 *  get:
 *    tags:
 *      - country
 *    summary: list countries stored in the database
 *    description: Returns an array of objects containing countryId and countryName
 *    operationId: listCountry
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
 *      '500':
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  apiErrors:
 *                    type: object
 *                    properties:
 *                      generalErrors:
 *                        type: array
 *                        items:
 *                          type: string
 *                          example: "something went wrong with the server"
 */

export default async function CreateCountry(
  req: NextApiRequest,
  res: NextApiResponse<
    CreateCountryResponse | ListCountries | CreateCountryError
  >
) {
  try {
    if (req.method === "POST") {
      const country = req.body.country;
      if (typeof country !== "string" || !country.length) {
        res.status(400).json({
          apiErrors: {
            validationError: {
              country: ["please provide valid value for country"],
            },
          },
        });
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
          apiErrors: {
            validationError: {
              country: ["The country name already exists in the database"],
            },
          },
        });
        return;
      }
      const createCountry = await prisma.country.create({
        data: {
          countryName: countryName,
        },
      });
      res.status(201).json({
        id: createCountry.countryId,
        country: createCountry.countryName,
      });
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
    res.status(500).json({
      apiErrors: { generalError: ["something went wrong with the server"] },
    });
  }
}
