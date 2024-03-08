import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import { prisma } from "@/db/prisma";
import {
  findRestaurant,
  capitalizeFirstWord,
  parseQueryVals,
  GetSearchInputsZod,
} from "@/utils";
import {
  GetSearchInputs,
  ResponseRestaurantGeoJsonFeatureCollection,
} from "@/utils/types";

/**
 *
 * @swagger
 *
 * /api/restaurant?{country}&{zipcode}:
 *     get:
 *       tags:
 *         - restaurants
 *       summary: find restaurants depending on query parameters
 *       description: Returns geojson restaurant feature collection
 *       operationId: searchRestaurant
 *       parameters:
 *         - name: zipcode
 *           in: query
 *           description: zipcode in USA
 *           required: true
 *           schema:
 *             type: string
 *             example: "55442"
 *         - name: country
 *           in: query
 *           description: country name
 *           required: true
 *           schema:
 *             type: string
 *             example: "U.S.A"
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "FeatureCollection"
 *                   features:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: "Feature"
 *                         id:
 *                           type: number
 *                         geometry:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                               example: "Point"
 *                             coordinates:
 *                               type: array
 *                               items:
 *                                 type: number
 *                                 example: -84.8076, 45.944
 *                         properties:
 *                            type: object
 *                            properties:
 *                              restaurantId:
 *                                type: string
 *                                format: uuid
 *                                example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                              restaurantName:
 *                                type: string
 *                              description:
 *                                type: string
 *                              street:
 *                                type: string
 *                                example: string
 *                              country:
 *                                type: string
 *                                example: "U.S.A"
 *                              state:
 *                                type: string
 *                                example: "Minnesota"
 *                              city:
 *                                type: string
 *                                example: "Minneapolis"
 *                              zipcode:
 *                                type: string
 *                                example: "55442"
 *                              foodTag:
 *                                type: array
 *                                items:
 *                                  type:
 *                                    string
 *                                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *
 *         '400':
 *           description: Invalid data supplied
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                     typeError:
 *                       type: string
 *                       example: "type check failed on the server, expected to an objects with countryName as string, and either zipcode as string or restaurantName as string or stateName, cityName, as string"
 *                     country:
 *                       type: string
 *                       example: "The provided countryName doesnot exist in the database"
 *                     zipcode:
 *                       type: string
 *                       example:   "The provided zipcode in reference to countryId doesnot exist in the database"
 *
 */

export default async function MapSearch(
  req: NextApiRequest,
  res: NextApiResponse<ResponseRestaurantGeoJsonFeatureCollection>
) {
  try {
    const { search } = req.query;
    const isQueryCorrect = z.string().safeParse(search);
    if (!isQueryCorrect.success) {
      console.log(isQueryCorrect.error);
      res.status(400).json({ typeError: "expected query param as string" });
      return;
    }
    const searchData = parseQueryVals(search as string);
    const isTypeCorrect = GetSearchInputsZod.safeParse(searchData);
    if (!isTypeCorrect.success) {
      console.log(isTypeCorrect.error);
      res.status(400).json({
        typeError:
          "type check failed on the server, expected to an objects with countryName as string, and either zipcode as string or restaurantName as string or stateName, cityName, as string",
      });
      return;
    }

    const queryProps = searchData as GetSearchInputs;
    const { country, state, city, zipcode, restaurantName } = queryProps;

    if (!state && !city && !restaurantName && !zipcode) {
      res.status(400).json({
        typeError:
          "type check failed on the server, you need to define either zipcode & countryName or stateName, cityName & countryName or restaurantName & country.",
      });
      return;
    }
    const countryExists = await prisma.country.findUnique({
      where: {
        countryName: country,
      },
    });
    if (!countryExists?.countryId) {
      res.status(400).json({
        country: "The provided countryName doesnot exist in the database",
      });
      return;
    }
    // search by zipcode
    if (zipcode.length > 1) {
      // send data by zipcode
      const zipcodeExists = await prisma.zipcode.findUnique({
        where: {
          zipcode_countryId: {
            zipcode: zipcode,
            countryId: countryExists.countryId,
          },
        },
      });
      if (!zipcodeExists?.zipcodeId) {
        res.status(400).json({
          zipcode:
            "The provided zipcode in reference to countryId doesnot exist in the database",
        });
        return;
      }
      // find restaurants by zipcde and countryId
      const restaurants = await findRestaurant({
        zipcodeId: zipcodeExists.zipcodeId,
        countryId: countryExists.countryId,
      });

      res.status(200).send({ restaurants: restaurants });
      return;
    }
    // search by city
    const stateExists = await prisma.state.findUnique({
      where: {
        countryId_stateName: {
          countryId: countryExists?.countryId,
          stateName: capitalizeFirstWord(state),
        },
      },
    });
    if (!stateExists?.stateId) {
      res.status(400).json({
        state:
          "The provided stateName inreference to countryId doesnot exist in the database",
      });
      return;
    }
    const cityExists = await prisma.city.findUnique({
      where: {
        countryId_stateId_cityName: {
          countryId: countryExists.countryId,
          stateId: stateExists.stateId,
          cityName: capitalizeFirstWord(city),
        },
      },
    });
    if (!cityExists?.cityId) {
      res.status(400).json({
        city: "The provided cityName in reference to countryId and stateName doesnot exist in the database",
      });
      return;
    }
    const restaurants = await findRestaurant({
      countryId: countryExists.countryId,
      stateId: stateExists.stateId,
      cityId: cityExists.cityId,
    });
    res.status(400).status(200).send({ restaurants: restaurants });
    return;
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ restaurantError: "something went wrong with the server" });
  }
}
