import * as React from "react";
import {
  Box,
  SimpleGrid,
  Group,
  Card,
  Image,
  Title,
  Text,
} from "@mantine/core";
import { ErrorCard } from "@/components";
import { SmallScreenGeolocationCard } from "./SmallScreenGeolocationCard";
import { SmallScreenToggleMapButton } from "../../map/SmallScreenToggleMapButton";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";

export type SmallScreenSearchResultListProps = {
  setToggleSmallScreenMap: (val: boolean) => void;
  toggleSmallScreenMap: boolean;
  geolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  >;
};

export const SmallScreenSearchResultList: React.FC<
  SmallScreenSearchResultListProps
> = ({ setToggleSmallScreenMap, toggleSmallScreenMap, geolocations }) => {
  const smallScreenToggleMapButton = {
    setToggleSmallScreenMap,
    toggleSmallScreenMap,
  };
  return geolocations.features.length > 0 ? (
    <Box style={{ margin: "auto" }}>
      <SimpleGrid
        mt={5}
        cols={3}
        verticalSpacing="md"
        breakpoints={[
          { maxWidth: 630, cols: 1, spacing: "xs" },
          { maxWidth: 930, cols: 2, spacing: "xs" },
        ]}
      >
        {geolocations.features.map((location, index) => {
          return <SmallScreenGeolocationCard key={index} location={location} />;
        })}
      </SimpleGrid>
      <Group mt={"sm"} position="center">
        <SmallScreenToggleMapButton {...smallScreenToggleMapButton} />
      </Group>
    </Box>
  ) : (
    <ErrorCard message="This location has no data" />
  );
};
