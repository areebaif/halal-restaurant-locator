import { prisma } from "@/db/prisma";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { CreateRestaurantZod, capitalizeFirstWord } from "@/utils";
import { CreateRestaurant, ResponseAddRestaurant } from "@/utils/types";

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
  res: NextApiResponse<ResponseAddRestaurant>
) {
  try {
    const restaurantData = req.body;
    const isTypeCorrect = CreateRestaurantZod.safeParse(restaurantData);
    if (!isTypeCorrect.success) {
      console.log(isTypeCorrect.error);
      res.status(400).json({
        typeError:
          "type check failed on the server, expected to an objects with countryId, stateName, cityName, restaurantName, description properties as string, foodtag property as array of uuid string , longitude and latitude properties as number",
      });
      return;
    }

    const parsedRestaurants = restaurantData as CreateRestaurant;
    // const parsedRestaurants = restaurantData as PostAddRestaurant;
    const countryId = parsedRestaurants.countryId;
    const stateName = capitalizeFirstWord(parsedRestaurants.stateName);
    const cityName = capitalizeFirstWord(parsedRestaurants.cityName);
    //const street = capitalizeFirstWord(parsedRestaurants.street);
    const street = parsedRestaurants.street;
    const foodTag = parsedRestaurants.foodTag;

    const countryExists = await prisma.country.findUnique({
      where: {
        countryId: countryId,
      },
    });
    if (!countryExists?.countryId) {
      res.status(400).json({
        country: "The provided countryId doesnot exist in the database",
      });
      return;
    }
    const stateExists = await prisma.state.findUnique({
      where: {
        countryId_stateName: {
          countryId: countryExists?.countryId,
          stateName: stateName,
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
          cityName: cityName,
        },
      },
    });
    if (!cityExists?.cityId) {
      res.status(400).json({
        city: "The provided cityName in reference to countryId and stateName doesnot exist in the database",
      });
      return;
    }

    const zipcodeExists = await prisma.zipcode.findUnique({
      where: {
        zipcode_countryId: {
          zipcode: parsedRestaurants.zipcode,
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
        foodTag:
          "Some of the values provided in foodtag array do not exist in the database",
      });
      return;
    }

    const restaurantId = uuidv4();
    const createRestaurant = prisma.restaurant.create({
      data: {
        restaurantId: restaurantId,
        zipcodeId: zipcodeExists.zipcodeId,
        countryId: countryExists.countryId,
        stateId: stateExists.stateId,
        cityId: cityExists.cityId,
        street: street,
        description: parsedRestaurants.description,
        restaurantName: parsedRestaurants.restaurantName,
        latitude: parsedRestaurants.latitude,
        longitude: parsedRestaurants.longitude,
      },
    });
    const addRestaurant_FoodTag = resolvedFoodTags.map((tag) =>
      prisma.restaurant_FoodTag.createMany({
        data: {
          FoodTagId: tag?.foodTagId!,
          RestaurantId: restaurantId,
        },
      })
    );
    await prisma.$transaction([createRestaurant, ...addRestaurant_FoodTag]);
    res.status(201).json({ created: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
