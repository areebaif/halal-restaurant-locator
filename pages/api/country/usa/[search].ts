import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { hasNumbers } from "@/utils";
import { ListGeography, ListCountryError } from "@/utils/types";

/**
 *
 * @swagger
 *
 * /api/country/usa/{search}:
 *  get:
 *    tags:
 *      - country
 *    summary: query either zipcode or city based on user input
 *    description: This api looks at the first 3 characters of the search term to filter rather large zipcode and city dataset to send relevant data
 *    operationId: listGeography
 *    parameters:
 *      - name: search
 *        in: path
 *        description: first 3 charcters of zipcode or city in U.S.A
 *        required: true
 *        schema:
 *          type: string
 *          example: "554"
 *    responses:
 *      '200':
 *        description: successful operation
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                zipcode:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      zipcodeId:
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
 *                city:
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
 *                        example: "Minnesota"
 *                      cityName:
 *                        type: string
 *                        example: "Minneapolis"
 *                country:
 *                  type: object
 *                  properties:
 *                    countryId:
 *                      type: string
 *                      format: uuid
 *                      example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                    countryName:
 *                      type: string
 *                      example: "U.S.A"
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
 *                      queryParamError:
 *                            type: array
 *                            items:
 *                              type: string
 *                              example: "expected query param as string"
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
  res: NextApiResponse<ListGeography | ListCountryError>
) {
  try {
    const { search } = req.query;
    const isQueryParamCorrect = z.string().safeParse(search);
    if (!isQueryParamCorrect.success) {
      console.log(isQueryParamCorrect.error);
      res.status(400).json({
        apiErrors: { queryParamError: ["expected query param as string"] },
      });
      return;
    }
    const stringQuery = search as string;
    const isZipcode = hasNumbers(stringQuery);
    const country = await prisma.country.findUnique({
      where: { countryName: "U.S.A" },
    });
    if (isZipcode) {
      // the search is a zipcode or invalid zipcode
      const zipcodeSplit = stringQuery.split("=");
      const zipcodeVal = zipcodeSplit[1];
      const zipcode = await prisma.zipcode.findMany({
        where: {
          zipcode: {
            startsWith: zipcodeVal,
          },
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
      const mappedZipcode = zipcode.map((item) => ({
        zipcodeId: item.zipcodeId,
        stateName: item.State.stateName,
        cityName: item.City.cityName,
        zipcode: item.zipcode,
        latitude: item.latitude,
        longitude: item.longitude,
        //country: item.Country.countryName,
      }));
      res.status(200).send({
        zipcode: mappedZipcode,
        country: {
          countryId: country?.countryId!,
          countryName: country?.countryName!,
        },
      });
    } else {
      // the search is a city name or invalid city name
      const citySplit = stringQuery.split("=");
      const cityVal = citySplit[1];
      const city = await prisma.city.findMany({
        where: {
          cityName: {
            startsWith: cityVal,
          },
        },
        select: {
          cityId: true,
          cityName: true,
          State: {
            select: { stateName: true, stateId: true },
          },
          Country: {
            select: { countryName: true, countryId: true },
          },
        },
      });
      const mappedCity = city.map((item) => ({
        cityId: item.cityId,
        stateName: item.State.stateName,
        cityName: item.cityName,
        //country: item.Country.countryName,
      }));
      res.status(200).send({
        city: mappedCity,
        country: {
          countryId: country?.countryId!,
          countryName: country?.countryName!,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      apiErrors: {
        generalError: ["something went wrong, please try again later"],
      },
    });
  }
}
