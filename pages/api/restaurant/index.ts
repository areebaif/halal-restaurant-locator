import { prisma } from "@/db/prisma";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import { CreateRestaurantZod } from "@/utils";
import {
  CreateRestaurant,
  CreateRestaurantSuccess,
  CreateRestaurantError,
} from "@/utils/types";

/**
 *
 * @swagger
 * /api/restaurant:
 *    post:
 *      tags:
 *        - restaurants
 *      summary: create a new restaurant
 *      description: add a restaurant to the database.
 *      operationId: createRestaurant
 *      requestBody:
 *        description: add a restaurant in the database.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                countryId:
 *                  type: string
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                stateId:
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                cityId:
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                zipcodeId:
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                restaurantId:
 *                  type: string
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                latitude:
 *                  type: number
 *                  format: float
 *                  example: 45.04856
 *                longitude:
 *                  type: number
 *                  format: float
 *                  example: -93.4269,
 *                foodTag:
 *                  type: array
 *                  items:
 *                    type:
 *                      string
 *                    example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                street:
 *                  type: string
 *                  example: string
 *                restaurantName:
 *                  type: string
 *                description:
 *                  type: string
 *                imageUrl:
 *                  type: array
 *                  items:
 *                    type:
 *                      string
 *                    example: "d16d6b71-c382-48ba-986b-c570b450f430/cover/131fa780-92e0-4c30-8428-9a5c780a91a3.png"

 *
 *        required: true
 *      responses:
 *        '201':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  created:
 *                    type: boolean
 *                    example: true
 *                  restaurantId:
 *                    type: string
 *                    example: "d16d6b71-c382-48ba-986b-c570b450f430"
 *        '400':
 *          description: Invalid data supplied
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    apiErrors:
 *                      type: object
 *                      properties:
 *                        validationErrors:
 *                          type: object
 *                          properties:
 *                            foodtag:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for foodTagId"
 *                            countryId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for countryId"
 *                            stateId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for stateId"
 *                            cityId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for cityId"
 *                            zipcodeId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for zipcodeId"
 *                            restaurantId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "The id should follow uuid format"
 *                            latitude:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide valid latitude as float in the range of -90 to 90"
 *                            longitude:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide valid longitude as float in the range of -180 to 180"
 *                            street:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide street value as string"
 *                            restaurantName:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide restaurantName value as string"
 *                            description:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide description value as string"
 *                            imageUrl:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide valid imageUrl as string"
 *        '500':
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    apiErrors:
 *                      type: object
 *                      properties:
 *                        generalErrors:
 *                          type: array
 *                          items:
 *                            type: string
 *                            example: "something went wrong with the server"
 */

export default async function CreateRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<CreateRestaurantSuccess | CreateRestaurantError>
) {
  try {
    if (req.method === "POST") {
      const restaurantData = req.body;
      const isTypeCorrect = CreateRestaurantZod.safeParse(restaurantData);
      if (!isTypeCorrect.success) {
        const {
          restaurantId,
          restaurantName,
          countryId,
          stateId,
          cityId,
          foodTag,
          description,
          street,
          latitude,
          longitude,
          imageUrl,
          zipcodeId,
        } = isTypeCorrect.error.flatten().fieldErrors;

        res.status(400).json({
          apiErrors: {
            validationErrors: {
              restaurantId,
              countryId,
              stateId,
              cityId,
              foodTag,
              description,
              street,
              latitude,
              longitude,
              imageUrl,
              zipcodeId,
              restaurantName,
            },
          },
        });
        return;
      }

      const restaurant = restaurantData as CreateRestaurant;
      const {
        countryId,
        stateId,
        cityId,
        foodTag,
        description,
        street,
        latitude,
        longitude,
        imageUrl,
        zipcodeId,
        restaurantName,
        restaurantId,
      } = restaurant;

      z.string().uuid().safeParse(restaurantId);
      const countryExists = await prisma.country.findUnique({
        where: {
          countryId: countryId,
        },
      });
      if (!countryExists?.countryId) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              countryId: [
                "The provided countryId does not exist in the database.",
              ],
            },
          },
        });
        return;
      }
      const stateExists = await prisma.state.findUnique({
        where: {
          stateId: stateId,
        },
      });
      if (!stateExists?.stateId) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              stateId: ["The provided stateId does not exist in the database."],
            },
          },
        });
        return;
      }
      const cityExists = await prisma.city.findUnique({
        where: {
          cityId: cityId,
        },
      });
      if (!cityExists?.cityId) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              cityId: ["The provided cityId does not exist in the database."],
            },
          },
        });
        return;
      }

      const zipcodeExists = await prisma.zipcode.findUnique({
        where: {
          zipcodeId: zipcodeId,
        },
      });

      if (!zipcodeExists?.zipcodeId) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              zipcodeId: [
                "The provided zipcodeId does not exist in the database.",
              ],
            },
          },
        });
        return;
      }

      const foodTagExists = foodTag.map((tag) =>
        prisma.foodTag.findUnique({
          where: {
            foodTagId: tag,
          },
        })
      );
      const resolvedFoodTags = await Promise.all(foodTagExists);
      let isNullValue = false;
      resolvedFoodTags.forEach((tag) =>
        !tag ? (isNullValue = true) : undefined
      );
      if (isNullValue) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              foodTag: [
                "The provided foodtagId does not exist in the database.",
              ],
            },
          },
        });
        return;
      }
      const createRestaurant = prisma.restaurant.create({
        data: {
          restaurantId: restaurantId,
          zipcodeId: zipcodeExists.zipcodeId,
          countryId: countryExists.countryId,
          stateId: stateExists.stateId,
          cityId: cityExists.cityId,
          street: street,
          description: description,
          restaurantName: restaurantName,
          latitude: latitude,
          longitude: longitude,
        },
      });
      const createRestaurant_FoodTag = resolvedFoodTags.map((tag) =>
        prisma.restaurant_FoodTag.createMany({
          data: {
            FoodTagId: tag?.foodTagId!,
            RestaurantId: restaurantId,
          },
        })
      );
      const createRestaurant_ImageUrl = imageUrl.map((url) =>
        prisma.restaurant_Image_Url.createMany({
          data: {
            restaurantId: restaurantId,
            imageUrl: url,
          },
        })
      );
      await prisma.$transaction([
        createRestaurant,
        ...createRestaurant_FoodTag,
        ...createRestaurant_ImageUrl,
      ]);
      res.status(201).json({ created: true, restaurantId: restaurantId });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      apiErrors: { generalErrors: ["something went wrong with the server"] },
    });
  }
}
