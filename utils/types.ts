import { z } from "zod";
import {
  ListGeographyZod,
  listCountryErrorZod,
  ListCountryZod,
  ListStateErrorZod,
  CreateCountryErrorZod,
  CreateCountryResponseZod,
  ListStatesZod,
  GetZipcodeErrorZod,
  GetZipcodeZod,
  CreateFoodTagErrorsZod,
  ListFoodTagsErrorZod,
  ListFoodTagsZod,
  CreateFoodTagZod,
  ListFoodTagsResponseZod,
  PostAddRestaurantZod,
  ResponseAddRestaurantZod,
  GetSearchInputsZod,
  ResponseRestaurantGeoJsonZod,
  GeoJsonRestaurantPropertiesZod,
  RestaurantReadDbZod,
  RestaurantGeoJsonFeatureZod,
  PostImageSignedUrlZod,
  ResponsePostSignedUrlZod,
  GetZipCodeResponseZod,
} from "./zod/zod";

export type CreateCountryResponse = z.infer<typeof CreateCountryResponseZod>;
export type CreateCountryError = z.infer<typeof CreateCountryErrorZod>;
export type ListCountries = z.infer<typeof ListCountryZod>;
export type ListCountryError = z.infer<typeof listCountryErrorZod>;
export type ListGeography = z.infer<typeof ListGeographyZod>;
export type ListStates = z.infer<typeof ListStatesZod>;
export type ListStateError = z.infer<typeof ListStateErrorZod>;
export type GetZipcodeError = z.infer<typeof GetZipcodeErrorZod>;
export type GetZipcode = z.infer<typeof GetZipcodeZod>;
export type GetZipCodeResponse = z.infer<typeof GetZipCodeResponseZod>;
export type CreateFoodTagErrors = z.infer<typeof CreateFoodTagErrorsZod>;
export type CreateFoodTag = z.infer<typeof CreateFoodTagZod>;
export type ListFoodTagsError = z.infer<typeof ListFoodTagsErrorZod>;
export type ListFoodTags = z.infer<typeof ListFoodTagsZod>;
export type ListFoodTagsResponse = z.infer<typeof ListFoodTagsResponseZod>;

export type PostAddRestaurant = z.infer<typeof PostAddRestaurantZod>;
export type ResponseAddRestaurant = z.infer<typeof ResponseAddRestaurantZod>;
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
