import { z } from "zod";
import {
  CreateFoodTagZod,
  ResponseAddCountryZod,
  ResponseAddStateZod,
  PostAddStateZod,
  PostAddCityZod,
  ResponseAddCityZod,
  PostAddZipcodeZod,
  ResponseAddZipcodeZod,
  PostAddRestaurantZod,
  ResponseAddRestaurantZod,
  ResponseGetAllGeogByCountryZod,
  GetSearchInputsZod,
  ResponseRestaurantGeoJsonZod,
  GeoJsonRestaurantPropertiesZod,
  RestaurantReadDbZod,
  RestaurantGeoJsonFeatureZod,
  ReadCountriesDbZod,
  ReadStateDbZod,
  ReadCityDbZod,
  ReadZipcodeDbZod,
  ListFoodTagsZod,
  PostImageSignedUrlZod,
  ResponsePostSignedUrlZod,
} from "./zod/zod";

export type CreateFoodTag = z.infer<typeof CreateFoodTagZod>;
export type ListFoodTags = z.infer<typeof ListFoodTagsZod>;
export type ResponseAddCountry = z.infer<typeof ResponseAddCountryZod>;
export type ResponseAddState = z.infer<typeof ResponseAddStateZod>;
export type ResponseAddCity = z.infer<typeof ResponseAddCityZod>;
export type ResponseAddZipcode = z.infer<typeof ResponseAddZipcodeZod>;
export type PostAddState = z.infer<typeof PostAddStateZod>;
export type PostAddCity = z.infer<typeof PostAddCityZod>;
export type PostAddZipcode = z.infer<typeof PostAddZipcodeZod>;
export type PostAddRestaurant = z.infer<typeof PostAddRestaurantZod>;
export type ResponseAddRestaurant = z.infer<typeof ResponseAddRestaurantZod>;
export type ResponseGetAllGeogByCountry = z.infer<
  typeof ResponseGetAllGeogByCountryZod
>;
export type GetSearchInputs = z.infer<typeof GetSearchInputsZod>;
export type RestaurantReadDb = z.infer<typeof RestaurantReadDbZod>;
export type RestaurantGeoJsonFeature = z.infer<
  typeof RestaurantGeoJsonFeatureZod
>;
export type GeoJsonRestaurantProperties = z.infer<
  typeof GeoJsonRestaurantPropertiesZod
>;
export type ResponseRestaurantGeoJsonFeatureCollection = z.infer<
  typeof ResponseRestaurantGeoJsonZod
>;

export type ReadCountriesDb = z.infer<typeof ReadCountriesDbZod>;
export type ReadStateDb = z.infer<typeof ReadStateDbZod>;
export type ReadCityDb = z.infer<typeof ReadCityDbZod>;
export type ReadZipcodeDb = z.infer<typeof ReadZipcodeDbZod>;

export type PostImageSignedUrl = z.infer<typeof PostImageSignedUrlZod>;
export type ResponsePostSignedUrl = z.infer<typeof ResponsePostSignedUrlZod>;

// for client
export type GeoJsonRestaurantFeatureCollection = {
  restaurants: {
    type: "FeatureCollection";
    features: {
      id: number;
      type: "Feature";
      geometry: {
        type: "Point";
        coordinates: [number, number];
      };

      properties: GeoJsonRestaurantProperties;
    }[];
  };
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  typeError?: string;
  restaurantError?: string;
};
