import {
  PostSearchInputs,
  ResponseAddFoodTag,
  ResponseGetAllGeog,
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

export const postMapSearchInput = async (data: PostSearchInputs) => {
  const response = await fetch(`/api/restaurant/restaurant-search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
  const res = await response.json();
  return res;
};

export const getGeogAutoComplete = async () => {
  const response = await fetch("/api/geography/get-all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res: ResponseGetAllGeog = await response.json();
  return res;
};
