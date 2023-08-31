import { prisma } from "@/db/prisma";
import { RestaurantReadDb } from "./types";

type searchCriteria = {
  zipcodeId?: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
  restaurantName?: string;
};

export const findRestaurant = async (searchCriteria: searchCriteria) => {
  const result = await prisma.restaurant.findMany({
    where: searchCriteria,
    select: {
      restaurantId: true,
      latitude: true,
      longitude: true,
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
    },
  });

  const mappedData = result.map((restaurantItem) => {
    const {
      restaurantId,
      latitude,
      longitude,
      restaurantName,
      description,
      Country,
      State,
      City,
      Zipcode,
      FoodTag,
      street,
    } = restaurantItem;
    return {
      restaurantId,
      latitude,
      longitude,
      restaurantName,
      description,
      street,
      country: Country.countryName,
      state: State.stateName,
      city: City.cityName,
      zipcode: Zipcode.zipcode,
      FoodTag: FoodTag.map((tag) => tag.FoodTag.name),
    };
  });
  const geoJson = restaurantToGeoJson(mappedData);
  return geoJson;
};

export const restaurantToGeoJson = (data: RestaurantReadDb["restaurants"]) => {
  return data?.map((restaurant) => {
    const {
      restaurantId,
      latitude,
      longitude,
      restaurantName,
      description,
      street,
      country,
      state,
      city,
      zipcode,
      FoodTag,
    } = restaurant;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        restaurantId,
        restaurantName,
        description,
        street,
        country,
        state,
        city,
        zipcode,
        FoodTag,
      },
    };
  });
};

// restaurantName: string;
//         description: string;
//         latitude: number;
// street
//         longitude: number;
//         FoodTag: string[];
//         country: string;
//         state: string;
//         city: string;
//         zipcode: string;
