import * as React from "react";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";

export const filterRestaurantsClient = (
  allGeolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  >,
  activeClientFoodTypeFilters: string[]
) => {
  const filteredList: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  > = { type: "FeatureCollection", features: [] };
  for (let x = 0; x < allGeolocations.features.length; x++) {
    let isFilterValValid = false;
    const { FoodTag } = allGeolocations.features[x].properties;
    for (let y = 0; y < FoodTag.length; y++) {
      for (let z = 0; z < activeClientFoodTypeFilters.length; z++) {
        if (FoodTag[y] === activeClientFoodTypeFilters[z]) {
          isFilterValValid = true;
          filteredList.features.push(allGeolocations.features[x]);
          break;
        }
      }
      if (isFilterValValid) break;
    }
  }
  return filteredList;
};
