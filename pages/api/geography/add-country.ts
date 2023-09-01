import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";
// local imports
import { ResponseAddCountry } from "@/utils/types";
import { capitalizeFirstWord } from "@/utils";

/**
 * @swagger
 * /api/geography/add-country:
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
 */

export default async function AddCountry(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddCountry>
) {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
