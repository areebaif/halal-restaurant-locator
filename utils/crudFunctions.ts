import {
  ResponseAddFoodTag,
  ResponseGetAllGeogByCountry,
  GeoJsonRestaurantFeatureCollection,
  ReadCountriesDb,
  ResponseAddState,
  ReadStateDb,
  PostAddState,
  PostAddCity,
  ResponseAddCity,
  ReadCityDb,
  PostAddZipcode,
  ResponseAddZipCode,
  ReadZipcodeDb,
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

export const postAddState = async (data: PostAddState) => {
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

export const postAddCity = async (data: PostAddCity) => {
  const response = await fetch(`/api/geography/add-city`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res: ResponseAddCity = await response.json();
  return res;
};

export const postAddZipcode = async (data: PostAddZipcode) => {
  const response = await fetch(`/api/geography/add-zipcode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res: ResponseAddZipCode = await response.json();
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
// this function populates the main search page auto complete
export const getAllUSA = async () => {
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

export const getStates = async () => {
  const response = await fetch(`/api/geography/get-state`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ReadStateDb = await response.json();
  return res;
};

export const getCities = async () => {
  const response = await fetch(`/api/geography/get-cities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ReadCityDb = await response.json();
  return res;
};

export const getZipcode = async () => {
  const response = await fetch(`/api/geography/get-zipcode`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ReadZipcodeDb = await response.json();
  return res;
};
