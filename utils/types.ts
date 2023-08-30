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
  GetSearchInputsZod,
  ResponseRestaurantGeoJsonZod,
  RestaurantReadDbZod,
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
export type GetSearchInputs = z.infer<typeof GetSearchInputsZod>;
export type RestaurantReadDb = z.infer<typeof RestaurantReadDbZod>;
export type ResponseRestaurantGeoJson = z.infer<
  typeof ResponseRestaurantGeoJsonZod
>;

export type GeoJsonRestaurant = {
  restaurants: {
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: GeoJsonRestaurantProps;
  }[];
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  typeError?: string;
  restaurantError?: string;
};

export type GeoJsonRestaurantProps = {
  restaurantName: string;
  description: string;
  street: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  FoodTag: string[];
};
