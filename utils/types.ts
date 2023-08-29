import { z } from "zod";
import {
  ErrorAddFoodTagZod,
  ResponseAddFoodTagZod,
  ResponseAddCountryZod,
  ResponseAddStateZod,
  PostAddStateZod,
  PostAddCityZod,
  ResponseAddCityZod,
  PostAddZipCodeZod,
  ResponseAddZipcodeZod,
  PostAddRestaurantZod,
  ResponseAddRestaurantZod,
  ResponseGetAllGeogZod,
  PostSearchInputsZod
} from "./zod/zod";

export type ErrorAddFoodTag = z.infer<typeof ErrorAddFoodTagZod>;
export type ResponseAddFoodTag = z.infer<typeof ResponseAddFoodTagZod>;
export type ResponseAddCountry = z.infer<typeof ResponseAddCountryZod>;
export type ResponseAddState = z.infer<typeof ResponseAddStateZod>;
export type ResponseAddCity = z.infer<typeof ResponseAddCityZod>;
export type ResponseAddZipCode = z.infer<typeof ResponseAddZipcodeZod>;
export type PostAddState = z.infer<typeof PostAddStateZod>;
export type PostAddCity = z.infer<typeof PostAddCityZod>;
export type PostAddZipCode = z.infer<typeof PostAddZipCodeZod>;
export type PostAddRestaurant = z.infer<typeof PostAddRestaurantZod>;
export type ResponseAddRestaurant = z.infer<typeof ResponseAddRestaurantZod>;
export type ResponseGetAllGeog = z.infer<typeof ResponseGetAllGeogZod>;
export type PostSearchInputs = z.infer<typeof PostSearchInputsZod>;
