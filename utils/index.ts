import {
  createFoodTag,
  listStates,
  getZipcode,
  helperListUploadImageUrl,
  listUSAGeog,
  createRestaurant,
  listRestaurantBySearchCriteria,
  listFoodTags,
  getRestaurantById,
} from "./crud-functions";
import {
  CreateFoodTagSchema,
  ListCountrySchema,
  ListStatesSchema,
  ListFoodTagsResponseSchema,
  ListFoodTagsSchema,
  CreateFoodTagResponseSchema,
  CreateUploadImageUrlSchema,
  ListUploadImageUrlSchema,
  GetZipCodeResponseSchema,
  ListUploadImageUrlResponseSchema,
  CreateRestaurantSchema,
  FilterRestaurantsByZipcodeSchema,
  FilterRestaurantsByCitySchema,
  GeoJsonFeatureCollectionRestaurantsSchema,
  CreateRestaurantResponseSchema,
  FilterRestaurantResponseSchema,
  FilterRestaurantsErrorsSchema,
} from "./zod/schema";
import {
  filterRestaurants,
  countryIdExists,
  stateIdExists,
  cityIdExists,
  validateFormDataCreateRestaurant,
} from "./api-utils";
import { calcBoundsFromCoordinates } from "./map/map-boundary-calculations";
import {
  capitalizeFirstWord,
  onlyNumbers,
  isValidCoordinate,
} from "./string-manipulation";

import { s3Client } from "./aws-S3-Client";
import { helperCreateUploadImageUrl } from "./image-uploads";
import { mapCountryData } from "./client-api-data-conversion";
import { boundingBoxCalc } from "./map/bounding-box";
import { parseFoodTypeFilter } from "./map/parse-filter-val-map-layer";
import { distanceBwTwoCordinatesInMiles } from "./map/distance-between-two-points";
import { filterRestaurantsClient } from "./map/filterRestaurants";

export {
  s3Client,
  listUSAGeog,
  ListCountrySchema,
  CreateFoodTagSchema,
  ListFoodTagsSchema,
  createFoodTag,
  listFoodTags,
  listStates,
  ListStatesSchema,
  GetZipCodeResponseSchema,
  CreateFoodTagResponseSchema,
  mapCountryData,
  ListFoodTagsResponseSchema,
  capitalizeFirstWord,
  CreateUploadImageUrlSchema,
  validateFormDataCreateRestaurant,
  helperListUploadImageUrl,
  ListUploadImageUrlSchema,
  ListUploadImageUrlResponseSchema,
  helperCreateUploadImageUrl,
  // parseQueryVals,
  onlyNumbers,
  getZipcode,
  isValidCoordinate,
  CreateRestaurantSchema,
  CreateRestaurantResponseSchema,
  FilterRestaurantsByZipcodeSchema,
  FilterRestaurantsByCitySchema,
  calcBoundsFromCoordinates,
  listRestaurantBySearchCriteria,
  createRestaurant,
  filterRestaurants,
  countryIdExists,
  stateIdExists,
  cityIdExists,
  GeoJsonFeatureCollectionRestaurantsSchema,
  FilterRestaurantResponseSchema,
  FilterRestaurantsErrorsSchema,
  getRestaurantById,
  boundingBoxCalc,
  distanceBwTwoCordinatesInMiles,
  parseFoodTypeFilter,
  filterRestaurantsClient,
};
