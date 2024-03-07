import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { onlyNumbers } from "@/utils";
import { GetZipcodeError, GetZipcode } from "@/utils/types";

/**
 *
 * @swagger
 *
 * /api/country/usa/zipcode/{zipcode}:
 *  get:
 *    tags:
 *      - country
 *    summary: query a single zipcode in the USA
 *    description: The api uses the query parameter (zipcode) to return an object with state, city and zipcode.
 *    operationId: getZipcode
 *    parameters:
 *      - name: zipcode
 *        in: path
 *        description: five digit U.S.A zipcode
 *        required: true
 *        schema:
 *          type: string
 *          example: "55433"
 *    responses:
 *      '200':
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                zipcode:
 *                    type: object
 *                    properties:
 *                      zipcodeId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      stateId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      cityId:
 *                        type: string
 *                        format: uuid
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      stateName:
 *                        type: string
 *                        example: "Minnesota"
 *                      cityName:
 *                        type: string
 *                        example: "Minneapolis"
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
 *                      countryId:
 *                        type: string
 *                        example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                      countryName:
 *                        type: string
 *                        example: "U.S.A"
 *
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
 *                          zipcode:
 *                            type: array
 *                            items:
 *                              type: string
 *                              example: "please provide five digit zipcode"
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
 */
export default async function GeographySearch(
  req: NextApiRequest,
  res: NextApiResponse<GetZipcode | GetZipcodeError>
) {
  try {
    const { zipcode } = req.query;
    const isQueryParamCorrect = z.string().safeParse(zipcode);
    if (!isQueryParamCorrect.success) {
      console.log(isQueryParamCorrect.error);
      res.status(400).json({
        apiErrors: {
          validationErrors: { zipcode: ["expected query param as string"] },
        },
      });
      return;
    }
    const country = await prisma.country.findUnique({
      where: { countryName: "U.S.A" },
    });

    const zipcodeVal = zipcode as string;
    const isZipcode = onlyNumbers(zipcodeVal);
    if (!isZipcode || zipcodeVal.length !== 5) {
      res.status(400).json({
        apiErrors: {
          validationErrors: { zipcode: ["please submit five digit zipcode"] },
        },
      });
      return;
    }

    // the search is a zipcode or invalid zipcode

    const zipcodeDb = await prisma.zipcode.findMany({
      where: {
        zipcode: zipcodeVal,
      },
      select: {
        zipcodeId: true,
        zipcode: true,
        latitude: true,
        longitude: true,
        Country: {
          select: { countryName: true, countryId: true },
        },
        State: {
          select: { stateName: true, stateId: true },
        },
        City: {
          select: { cityName: true, cityId: true },
        },
      },
    });
    if (zipcodeDb.length !== 1) {
      res.status(400).json({
        apiErrors: {
          validationErrors: {
            zipcode: ["unable to find zipcode with the value supplied"],
          },
        },
      });
      return;
    }
    const mappedZipcode = zipcodeDb.map((item) => ({
      zipcodeId: item.zipcodeId,
      zipcode: item.zipcode,
      stateName: item.State.stateName,
      cityName: item.City.cityName,
      cityId: item.City.cityId,
      stateId: item.State.stateId,
      latitude: item.latitude,
      longitude: item.longitude,
      countryId: item.Country.countryId,
      countryName: item.Country.countryName,
      //country: item.Country.countryName,
    }));
    res.status(200).send({
      zipcode: mappedZipcode[0],
    });
  } catch (err) {
    res.status(500).json({
      apiErrors: {
        generalError: ["something went wrong, please try again later"],
      },
    });
  }
}
