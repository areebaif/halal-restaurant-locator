import * as React from "react";

import { Flex, Box, Card, Image, Title, Text, ScrollArea } from "@mantine/core";
import { ErrorCard } from "../../..";
import { MapContainerProps } from "../../map/MapContainer";
import { LargeVPGeolocationCard } from "./LargeVPSearchResultRestaurantCard";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";

type filteredRestaurantTypes = {
  restaurantId: string;
  restaurantName: string;
  description: string;
  street: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  FoodTag: string[];
  coverImageUrl: string;
  otherImageUrlList: string[];
  visited: boolean;
};
const filterList = (
  filterVal: string,
  // these are the filteredGeolocations
  filteredGeoLocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  >,
  // these are the shallowCopy
  restaurantLocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    filteredRestaurantTypes
  >
) => {
  restaurantLocations.features.forEach((location) => {
    location.properties.FoodTag.forEach((tag) => {
      if (tag === filterVal) {
        location.properties.visited = true;
        filteredGeoLocations.features.push(location);
      }
    });
  });
};

export const LargeVPSearchResultList: React.FC<MapContainerProps> = ({
  geolocations,
  hoverId,
  setHoverId,
  showPopup,
  setShowPopup,
  popupData,
  setPopupData,
  foodTypeFilters,
}) => {
  const geoLocationCardProps = {
    hoverId,
    setHoverId,
    showPopup,
    setShowPopup,
    popupData,
    setPopupData,
    foodTypeFilters,
  };
  let filteredGeolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  >;
  if (foodTypeFilters.length > 0 && geolocations.features.length > 0) {
    // this is the array where  we will push the filtered geolocations
    const filtered: GeoJSON.FeatureCollection<
      GeoJSON.Geometry,
      GeoJsonPropertiesRestaurant
    > = { type: "FeatureCollection", features: [] };

    // create a copy of geolocations with visited flag
    const restaurantLocations: GeoJSON.FeatureCollection<
      GeoJSON.Geometry,
      filteredRestaurantTypes
    > = {
      type: "FeatureCollection",
      features: [],
    };
    geolocations.features.forEach((feature) => {
      const { properties, id, type, geometry } = feature;
      const newProps = { ...feature.properties, visited: false };
      restaurantLocations.features.push({
        id,
        type,
        geometry,
        properties: newProps,
      });
    }),
      foodTypeFilters.forEach((foodType) =>
        filterList(foodType, filtered, restaurantLocations)
      );

    filteredGeolocations = filtered;
  } else {
    filteredGeolocations = geolocations;
  }

  return geolocations.features.length > 0 ? (
    <Flex mt={5} direction={"column"}>
      <ScrollArea offsetScrollbars type="always" h={600}>
        {filteredGeolocations.features.map((location) => {
          return (
            <LargeVPGeolocationCard
              key={location.properties.restaurantId}
              location={location}
              {...geoLocationCardProps}
            />
          );
        })}
      </ScrollArea>
    </Flex>
  ) : (
    <ErrorCard message="This location has no data" />
  );
};
