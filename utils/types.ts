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
  CreateFoodTagZod,
  CreateFoodTagResponseZod,
  ListFoodTagsErrorZod,
  ListFoodTagsZod,
  ListFoodTagsResponseZod,
  CreateUploadImageUrlZod,
  ListUploadImageUrlZod,
  ListUploadImageUrlErrorZod,
  ListUploadImageUrlResponseZod,
  CreateRestaurantZod,
  CreateRestaurantErrorZod,
  CreateRestaurantSuccessZod,
  CreateRestaurantResponseZod,
  FilterRestaurantsByZipcodeZod,
  FilterRestaurantsByCityZod,
  GetZipCodeResponseZod,
  FilterRestaurantsErrorsZod,
  GeoJsonPropertiesRestaurantZod,
  GeoJsonFeatureRestaurantZod,
  GeoJsonFeatureCollectionRestaurantsZod,
  RestaurantReadDbZod,
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
export type CreateFoodTagResponse = z.infer<typeof CreateFoodTagResponseZod>;
export type ListFoodTagsError = z.infer<typeof ListFoodTagsErrorZod>;
export type ListFoodTags = z.infer<typeof ListFoodTagsZod>;
export type ListFoodTagsResponse = z.infer<typeof ListFoodTagsResponseZod>;
export type CreateUploadImageUrl = z.infer<typeof CreateUploadImageUrlZod>;
export type ListUploadImageUrl = z.infer<typeof ListUploadImageUrlZod>;
export type ListUploadImageUrlError = z.infer<
  typeof ListUploadImageUrlErrorZod
>;
export type ListUploadImageUrlResponse = z.infer<
  typeof ListUploadImageUrlResponseZod
>;
export type CreateRestaurant = z.infer<typeof CreateRestaurantZod>;
export type CreateRestaurantError = z.infer<typeof CreateRestaurantErrorZod>;
export type CreateRestaurantSuccess = z.infer<
  typeof CreateRestaurantSuccessZod
>;
export type CreateRestaurantResponse = z.infer<
  typeof CreateRestaurantResponseZod
>;
export type FilterRestaurantsByZipcode = z.infer<
  typeof FilterRestaurantsByZipcodeZod
>;
export type FilterRestaurantsByCity = z.infer<
  typeof FilterRestaurantsByCityZod
>;
export type FilterRestaurantsErrors = z.infer<
  typeof FilterRestaurantsErrorsZod
>;
export type GeoJsonFeatureCollectionRestaurants = z.infer<
  typeof GeoJsonFeatureCollectionRestaurantsZod
>;

export type RestaurantReadDb = z.infer<typeof RestaurantReadDbZod>;

export type GeoJsonFeatureRestaurant = z.infer<
  typeof GeoJsonFeatureRestaurantZod
>;
export type GeoJsonPropertiesRestaurant = z.infer<
  typeof GeoJsonPropertiesRestaurantZod
>;

// for client
export type RestaurantGeoJsonFeatureCollectionClient = {
  restaurants: {
    type: "FeatureCollection";
    features: {
      id: number;
      type: "Feature";
      geometry: {
        type: "Point";
        coordinates: [number, number];
      };
      properties: GeoJsonPropertiesRestaurant;
    }[];
  };
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  typeError?: string;
  restaurantError?: string;
};
