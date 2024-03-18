import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import { prisma } from "@/db/prisma";
import {} from "@/utils";
import { GetRestaurantError, GetRestaurant } from "@/utils/types";

/**
 *
 * @swagger
 *
 * /api/restaurant/{restaurantId}:
 *     get:
 *       tags:
 *         - restaurants
 *       summary: get restaurant by restaurantId
 *       description: Returns geojson restaurant feature collection
 *       operationId: findRestaurantById
 *       parameters:
 *         - name: restaurantId
 *           in: path
 *           description: restaurantId
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *             example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   restaurantId:
 *                     type: string
 *                     format: uuid
 *                     example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                   restaurantName:
 *                     type: string
 *                   description:
 *                     type: string
 *                   street:
 *                     type: string
 *                     example: string
 *                   country:
 *                     type: string
 *                     example: "U.S.A"
 *                   state:
 *                     type: string
 *                     example: "Minnesota"
 *                   city:
 *                     type: string
 *                     example: "Minneapolis"
 *                   zipcode:
 *                     type: string
 *                     example: "55442"
 *                   foodTag:
 *                     type: array
 *                     items:
 *                       type:
 *                         string
 *                       example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                   imageUrl:
 *                     type: array
 *                     items:
 *                       type:
 *                         string
 *                       example: "64b31531-28fd-4570-ad64-6aa312e53d69/cover/64b31531-28fd-4570-ad64-6aa312e53d69.png"
 *
 *         '400':
 *           description: Invalid data supplied
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                     apiErrors:
 *                       type: object
 *                       properties:
 *                          validationErrors:
 *                            type: object
 *                            properties:
 *                              restaurantId:
 *                                    type: array
 *                                    items:
 *                                      type: string
 *                                      example: "no record exists with the provided restaurantId"
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                     apiErrors:
 *                       type: object
 *                       properties:
 *                         generalErrors:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: "something went wrong with the server" */

export default async function MapSearch(
  req: NextApiRequest,
  res: NextApiResponse<GetRestaurantError | GetRestaurant>
) {
  try {
    const { restaurantId } = req.query;

    const isQueryCorrect = z.string().uuid().safeParse(restaurantId);
    if (!isQueryCorrect.success) {
      console.log(isQueryCorrect.error);
      res.status(400).json({
        apiErrors: {
          validationErrors: {
            restaurantId: ["expected query param as valid string uuid"],
          },
        },
      });
      return;
    }
    const id = restaurantId as string;
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        restaurantId: id,
      },
      select: {
        restaurantId: true,
        restaurantName: true,
        description: true,
        street: true,
        Country: {
          select: {
            countryName: true,
          },
        },
        FoodTag: {
          select: {
            FoodTag: true,
          },
        },
        State: {
          select: { stateName: true },
        },
        City: {
          select: { cityName: true },
        },
        Zipcode: {
          select: { zipcode: true },
        },
        RestaurantImageUrl: {
          select: { imageUrl: true },
        },
      },
    });
    if (!restaurant) {
      res.status(400).json({
        apiErrors: {
          validationErrors: {
            restaurantId: ["no record exists with the provided restaurantId"],
          },
        },
      });
      return;
    }
    const dbRestaurantId = restaurant.restaurantId;
    const {
      restaurantName,
      description,
      Country,
      State,
      City,
      Zipcode,
      FoodTag,
      street,
      RestaurantImageUrl,
    } = restaurant;

    res.status(200).send({
      restaurantId: dbRestaurantId,
      restaurantName,
      description,
      street,
      country: Country.countryName,
      state: State.stateName,
      city: City.cityName,
      zipcode: Zipcode.zipcode,
      FoodTag: FoodTag.map((tag) => tag.FoodTag.name),
      imageUrl: RestaurantImageUrl.map((url) => url.imageUrl),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      apiErrors: { generalError: ["something went wrong with the server"] },
    });
  }
}
