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
 *                stateName:
 *                  type: string
 *                  example: "Minnesota"
 *                cityName:
 *                  type: string
 *                  example: "Minneapolis"
 *                zipcode:
 *                  type: string
 *                  example: "55442"
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
 *                    type: string
 *                    example: "ok"
 *        '400':
 *          description: Invalid data supplied
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  typeError:
 *                    type: string
 *                    example:   "type check failed on the server, expected to an objects with countryId, stateName, cityName, restaurantName, description properties as string, foodtag property as array of uuid string , longitude and latitude properties as number"
 *                  country:
 *                    type: string
 *                    example: "The provided countryId doesnot exist in the database"
 *                  state:
 *                    type: string
 *                    example: "The provided stateName in reference to countryId doesnot exist in the database"
 *                  city:
 *                    type: string
 *                    example:  "The provided cityName in reference to countryId and stateName doesnot exist in the database"
 *                  zipcode:
 *                    type: string
 *                    example:  "The provided zipcode in reference to countryId doesnot exist in the database"
 *                  foodTag:
 *                    type: string
 *                    example: "Some of the values provided in foodtag array do not exist in the database"
 */

export default async function CreateRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<CreateRestaurantSuccess | CreateRestaurantError>
) {
  try {
    const restaurantData = req.body;
    const isTypeCorrect = CreateRestaurantZod.safeParse(restaurantData);
    if (!isTypeCorrect.success) {
      console.log(isTypeCorrect.error);
      res.status(400).json({
        apiErrors: {
          validationErrors: {
            countryId: [
              "type check failed on the server, expected to an objects with countryId, stateName, cityName, restaurantName, description properties as string, foodtag property as array of uuid string , longitude and latitude properties as number",
            ],
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
            foodTag: ["The provided foodtagId does not exist in the database."],
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
    res.status(201).json({ created: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      apiErrors: { generalErrors: ["something went wrong with the server"] },
    });
  }
}
