import {
  ResponseAddFoodTag,
  ResponseGetAllGeogByCountry,
  GeoJsonRestaurantFeatureCollection,
  ReadCountriesDb,
  ResponseAddState,
} from "./types";

export const postAddFoodTag = async (data: { foodTag: string }) => {
  const { foodTag } = data;
  const response = await fetch(`/api/restaurant/add-tag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ foodTag: foodTag }),
  });
  const res: ResponseAddFoodTag = await response.json();
  return res;
};

export const postAddState = async (
  data: {
    stateName: string[];
    countryName: string;
    countryId: string;
  }[]
) => {
  const response = await fetch(`/api/geography/add-state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res: ResponseAddState = await response.json();
  return res;
};

export const postAddCity = async (data: {
  cityName: string[];
  countryId: string;
  stateName: string;
}) => {
  const { stateName, countryId, cityName } = data;
  const response = await fetch(`/api/geography/add-city`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countryId,
      stateName,
      cityName,
    }),
  });
  const res: ResponseAddFoodTag = await response.json();
  return res;
};

export const getMapSearchInput = async (data: string) => {
  const response = await fetch(`/api/restaurant/${data}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: GeoJsonRestaurantFeatureCollection = await response.json();
  return res;
};

export const getCountryAutoComplete = async () => {
  const response = await fetch(`/api/geography/get-all-usa`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ResponseGetAllGeogByCountry = await response.json();
  return res;
};

export const getAllCountries = async () => {
  const response = await fetch(`/api/geography/get-all-countries`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ReadCountriesDb = await response.json();
  return res;
};
