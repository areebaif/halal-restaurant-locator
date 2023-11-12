import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { ResponseGetAllGeogByCountry } from "@/utils/types";

/**
 * @swagger
 * /api/geography/country/usa:
 *  get:
 *    tags:
 *      - geolocations
 *    summary: get states, cities, zipcodes populated in the database with respect to U.S.A
 *    description: Returns object with zipcode, state, city as array of objects
 *    operationId: getAllGeographyByCountry
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
 *                        example: "Minnesota"
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
 */

export default async function GetGeographyInputs(
  req: NextApiRequest,
  res: NextApiResponse<ResponseGetAllGeogByCountry>
) {
  // get zipcode
  const country = await prisma.country.findUnique({
    where: { countryName: "U.S.A" },
  });

  const zipcode = await prisma.zipcode.findMany({
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
  const state = await prisma.state.findMany({
    select: {
      stateId: true,
      stateName: true,
      Country: {
        select: { countryName: true, countryId: true },
      },
    },
  });
  const mappedState = state.map((item) => ({
    stateId: item.stateId,
    stateName: item.stateName,
    //country: item.Country.countryName,
  }));
  //get city
  const city = await prisma.city.findMany({
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
    zipcode: mappedZipcode,
    city: mappedCity,
    state: mappedState,
    country: {
      countryId: country?.countryId!,
      countryName: country?.countryName!,
    },
  });
}
