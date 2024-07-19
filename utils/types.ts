import { z } from "zod";
import {
  ListGeographySchema,
  ListCountrySchema,
  ListCountryErrorSchema,
  ListStateErrorSchema,
  CreateCountryErrorSchema,
  CreateCountryResponseSchema,
  ListStatesSchema,
  ListCitiesSchema,
  ListCitiesErrorSchema,
  ListCitiesResponseSchema,
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
export type ListCities = z.infer<typeof ListCitiesSchema>;
export type ListCitiesError = z.infer<typeof ListCitiesErrorSchema>;
export type ListCitiesResponse = z.infer<typeof ListCitiesResponseSchema>;
export type GetZipcodeError = z.infer<typeof GetZipcodeErrorSchema>;
export type GetZipcode = z.infer<typeof GetZipcodeSchema>;
export type GetZipCodeResponse = z.infer<typeof GetZipCodeResponseSchema>;
export type CreateFoodTagErrors = z.infer<typeof CreateFoodTagErrorsSchema>;
export type CreateFoodTag = z.infer<typeof CreateFoodTagSchema>;
export type CreateFoodTagResponse = z.infer<typeof CreateFoodTagResponseSchema>;
export type ListFoodTagsError = z.infer<typeof ListFoodTagsErrorSchema>;
export type ListFoodTags = z.infer<typeof ListFoodTagsSchema>;
export type ListFoodTagsResponse = z.infer<typeof ListFoodTagsResponseSchema>;
export type CreateUploadImageUrl = z.infer<typeof CreateUploadImageUrlSchema>;
export type ListUploadImageUrl = z.infer<typeof ListUploadImageUrlSchema>;
export type ListUploadImageUrlError = z.infer<
  typeof ListUploadImageUrlErrorSchema
>;
export type ListUploadImageUrlResponse = z.infer<
  typeof ListUploadImageUrlResponseSchema
>;
export type GetRestaurantError = z.infer<typeof GetRestaurantErrorSchema>;
export type GetRestaurant = z.infer<typeof GetRestaurantSchema>;
export type CreateRestaurant = z.infer<typeof CreateRestaurantSchema>;
export type CreateRestaurantError = z.infer<typeof CreateRestaurantErrorSchema>;
export type CreateRestaurantSuccess = z.infer<
  typeof CreateRestaurantSuccessSchema
>;
export type CreateRestaurantResponse = z.infer<
  typeof CreateRestaurantResponseSchema
>;
export type FilterRestaurantsByZipcode = z.infer<
  typeof FilterRestaurantsByZipcodeSchema
>;
export type FilterRestaurantsByCity = z.infer<
  typeof FilterRestaurantsByCitySchema
>;
export type FilterRestaurantsErrors = z.infer<
  typeof FilterRestaurantsErrorsSchema
>;
export type GeoJsonFeatureCollectionRestaurants = z.infer<
  typeof GeoJsonFeatureCollectionRestaurantsSchema
>;
export type FilterRestaurantResponse = z.infer<
  typeof FilterRestaurantResponseSchema
>;
export type ListRestaurants = z.infer<typeof ListRestaurantsSchema>;

export type GeoJsonFeatureRestaurant = z.infer<
  typeof GeoJsonFeatureRestaurantSchema
>;
export type GeoJsonPropertiesRestaurant = z.infer<
  typeof GeoJsonPropertiesRestaurantSchema
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
