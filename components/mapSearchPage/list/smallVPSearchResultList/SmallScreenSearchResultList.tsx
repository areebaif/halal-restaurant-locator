import * as React from "react";
import { Box, Group, Card, Image, Title, Text, Flex } from "@mantine/core";
import { ErrorCard } from "@/components";
import { SmallScreenGeolocationCard } from "./SmallScreenGeolocationCard";
import { SmallScreenToggleMapButton } from "../../map/SmallScreenToggleMapButton";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";
import { filterRestaurantsClient } from "@/utils";

export type SmallScreenSearchResultListProps = {
  foodTypeFilters: string[];
  setToggleSmallScreenMap: (val: boolean) => void;
  toggleSmallScreenMap: boolean;
  geolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  >;
};

export const SmallScreenSearchResultList: React.FC<
  SmallScreenSearchResultListProps
> = ({
  setToggleSmallScreenMap,
  toggleSmallScreenMap,
  geolocations,
  foodTypeFilters,
}) => {
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

  const smallScreenToggleMapButton = {
    setToggleSmallScreenMap,
    toggleSmallScreenMap,
  };

  return geolocations.features.length > 0 ? (
    <Box>
      <Flex justify="center" gap="xs" wrap={"wrap"}>
        {filteredGeolocations.features.map((location, index) => {
          return <SmallScreenGeolocationCard key={index} location={location} />;
        })}
      </Flex>
      <Group mt={"sm"} position="center">
        <SmallScreenToggleMapButton {...smallScreenToggleMapButton} />
      </Group>
    </Box>
  ) : (
    <ErrorCard message="This location has no data" />
  );
};
