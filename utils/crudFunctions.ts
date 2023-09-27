import {
  ResponseAddFoodTag,
  ResponseGetAllGeogByCountry,
  GeoJsonRestaurantFeatureCollection,
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

export const postAddState = async (data: { stateName: string[], countryId: string }) => {
  const { stateName, countryId } = data;
  const response = await fetch(`/api/restaurant/add-state`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ countryId: countryId, stateName: stateName }),
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

export const getGeogAutoComplete = async () => {
  const response = await fetch(`/api/geography/get-all-usa`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ResponseGetAllGeogByCountry = await response.json();
  return res;
};
