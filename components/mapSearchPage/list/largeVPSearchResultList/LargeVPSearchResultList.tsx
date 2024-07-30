import * as React from "react";
import { Flex, ScrollArea } from "@mantine/core";
import { ErrorCard } from "@/components";
import { MapContainerProps } from "../../map/MapContainer";
import { LargeVPGeolocationCard } from "./LargeVPSearchResultRestaurantCard";
import { filterRestaurantsClient } from "@/utils";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";

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
  if (geolocations.features.length > 0) {
    const visibleList = React.useMemo(
      () => filterRestaurantsClient(geolocations, foodTypeFilters),
      [geolocations, foodTypeFilters]
    );

    filteredGeolocations = visibleList.features.length
      ? visibleList
      : geolocations;
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
