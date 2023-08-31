import { prisma } from "@/db/prisma";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
// local imports
import { PostAddRestaurantZod, capitalizeFirstWord } from "@/utils";
import { PostAddRestaurant, ResponseAddRestaurant } from "@/utils/types";

export default async function AddState(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddRestaurant>
) {
  try {
    const restaurantData = req.body;
    const isTypeCorrect = PostAddRestaurantZod.safeParse(restaurantData);
    if (!isTypeCorrect.success) {
      console.log(isTypeCorrect.error);
      res.json({
        typeError:
          "type check failed on the server, expected to an objects with countryId, stateName, cityName, restaurantName, description properties as string, foodtag property as array of uuid string , longitude and latitude properties as number",
      });
      return;
    }

    const parsedRestaurants = restaurantData as PostAddRestaurant;
    // const parsedRestaurants = restaurantData as PostAddRestaurant;
    const countryId = parsedRestaurants.countryId;
    const stateName = capitalizeFirstWord(parsedRestaurants.stateName);
    const cityName = capitalizeFirstWord(parsedRestaurants.cityName);
    const street = capitalizeFirstWord(parsedRestaurants.street);
    const foodTag = parsedRestaurants.foodTag;

    const countryExists = await prisma.country.findUnique({
      where: {
        countryId: countryId,
      },
    });
    if (!countryExists?.countryId) {
      res.json({
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
      res.json({
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
      res.json({
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
      res.json({
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
      res.json({
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
    res.status(202).json({ created: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
