import { prisma } from "@/db/prisma";
import {
  RestaurantReadDb,
  ResponseRestaurantGeoJsonFeatureCollection,
  RestaurantGeoJsonFeature,
  CreateUploadImageUrl,
} from "./types";

import { CreateUploadImageUrlZod } from ".";
type searchCriteria = {
  zipcodeId?: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
  restaurantName?: string;
};

export const dataToGeoJson = (data: RestaurantReadDb["restaurants"]) => {
  const features: RestaurantGeoJsonFeature = data?.map((restaurant, index) => {
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
      id: index,
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

  const result: ResponseRestaurantGeoJsonFeatureCollection["restaurants"] = {
    type: "FeatureCollection",
    features: features ? features : [],
  };
  return result;
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
  const geoJson = dataToGeoJson(mappedData);
  return geoJson;
};

export const countryIdExists = async (data: { countryId: string }[]) => {
  const countryIdSet: Set<string> = new Set();

  data.forEach((item) => {
    countryIdSet.add(item.countryId);
  });
  const countryArray = Array.from(countryIdSet);
  const countryPromise = countryArray.map((item) =>
    prisma.country.findUnique({ where: { countryId: item } })
  );
  const resolvedCountry = await Promise.all(countryPromise);
  let countryNotFound = false;
  // its not possible to break out of foreach loop
  for (let x = 0; x < resolvedCountry.length; x++) {
    if (!resolvedCountry[x]) {
      countryNotFound = true;
      break;
    }
  }
  return countryNotFound;
};

export const stateIdExists = async (data: { stateId: string }[]) => {
  const stateIdSet: Set<string> = new Set();
  data.forEach((item) => {
    stateIdSet.add(item.stateId);
  });

  const stateArray = Array.from(stateIdSet);

  const statePromise = stateArray.map((item) =>
    prisma.state.findUnique({ where: { stateId: item } })
  );

  const resolvedState = await Promise.all(statePromise);

  let stateNotFound = false;
  for (let x = 0; x < resolvedState.length; x++) {
    if (!resolvedState[x]) {
      stateNotFound = true;
      break;
    }
  }
  return stateNotFound;
};

export const cityIdExists = async (data: { cityId: string }[]) => {
  const cityIdSet: Set<string> = new Set();
  data.forEach((item) => {
    cityIdSet.add(item.cityId);
  });

  const cityArray = Array.from(cityIdSet);

  const cityPromise = cityArray.map((item) =>
    prisma.city.findUnique({ where: { cityId: item } })
  );

  const resolvedCity = await Promise.all(cityPromise);

  let cityNotFound = false;
  for (let x = 0; x < resolvedCity.length; x++) {
    if (!resolvedCity[x]) {
      cityNotFound = true;
      break;
    }
  }
  return cityNotFound;
};

export const validateFormDataCreateRestaurant = (
  allImages: CreateUploadImageUrl,
  setFormFieldsErrorMessage: React.Dispatch<
    React.SetStateAction<
      | {
          cover?: string[] | undefined;
          otherImages?: string[] | undefined;
        }
      | undefined
    >
  >
) => {
  const isTypeCorrent = CreateUploadImageUrlZod.safeParse(allImages);

  if (!isTypeCorrent.success) {
    console.log(isTypeCorrent.error);
    const schemaErrors = isTypeCorrent.error.flatten().fieldErrors;
    if (schemaErrors.otherImages?.length) {
      setFormFieldsErrorMessage((prevState) => ({
        ...prevState,
        otherImages: schemaErrors.otherImages!,
      }));
    }
    if (schemaErrors.cover?.length) {
      setFormFieldsErrorMessage((prevState) => ({
        ...prevState,
        cover: schemaErrors.cover!,
      }));
    }
    return;
  }
};
