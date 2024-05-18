import { z } from "zod";
import {
  ListGeographySchema,
  ListCountrySchema,
  ListCountryErrorSchema,
  ListStateErrorSchema,
  CreateCountryErrorSchema,
  CreateCountryResponseSchema,
  ListStatesSchema,
  GetZipcodeErrorSchema,
  GetZipcodeSchema,
  CreateFoodTagErrorsSchema,
  CreateFoodTagSchema,
  CreateFoodTagResponseSchema,
  ListFoodTagsErrorSchema,
  ListFoodTagsSchema,
  ListFoodTagsResponseSchema,
  CreateUploadImageUrlSchema,
  ListUploadImageUrlSchema,
  ListUploadImageUrlErrorSchema,
  ListUploadImageUrlResponseSchema,
  CreateRestaurantSchema,
  CreateRestaurantErrorSchema,
  CreateRestaurantSuccessSchema,
  CreateRestaurantResponseSchema,
  FilterRestaurantsByZipcodeSchema,
  FilterRestaurantsByCitySchema,
  GetZipCodeResponseSchema,
  FilterRestaurantsErrorsSchema,
  GeoJsonPropertiesRestaurantSchema,
  FilterRestaurantResponseSchema,
  GeoJsonFeatureRestaurantSchema,
  GeoJsonFeatureCollectionRestaurantsSchema,
  ListRestaurantsSchema,
  GetRestaurantErrorSchema,
  GetRestaurantSchema,
} from "./zod/schema";

export type CreateCountryResponse = z.infer<typeof CreateCountryResponseSchema>;
export type CreateCountryError = z.infer<typeof CreateCountryErrorSchema>;
export type ListCountries = z.infer<typeof ListCountrySchema>;
export type ListCountryError = z.infer<typeof ListCountryErrorSchema>;
export type ListGeography = z.infer<typeof ListGeographySchema>;
export type ListStates = z.infer<typeof ListStatesSchema>;
export type ListStateError = z.infer<typeof ListStateErrorSchema>;
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
export type GetRestaurantError = z.infer<typeof GetRestaurantErrorZod>;
export type GetRestaurant = z.infer<typeof GetRestaurantZod>;
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
export type FilterRestaurantResponse = z.infer<
  typeof FilterRestaurantResponseZod
>;
export type ListRestaurants = z.infer<typeof ListRestaurantsZod>;

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
};
