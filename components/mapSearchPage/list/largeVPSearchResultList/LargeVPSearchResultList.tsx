import * as React from "react";

import { Flex, Box, Group } from "@mantine/core";
import { ErrorCard } from "../../..";
import { MapContainerProps } from "../../map/MapContainer";
import { SmallScreenToggleMapButton } from "../../map/SmallScreenToggleMapButton";
import { LargeVPGeolocationCard } from "./LargeVPSearchResultRestaurantCard";

export const LargeVPSearchResultList: React.FC<MapContainerProps> = ({
  geolocations,
  hoverId,
  setHoverId,
  showPopup,
  setShowPopup,
  popupData,
  setPopupData,
  setToggleSmallScreenMap,
  toggleSmallScreenMap,
}) => {
  const geoLocationCardProps = {
    hoverId,
    setHoverId,
    showPopup,
    setShowPopup,
    popupData,
    setPopupData,
  };
  const smallScreenToggleMapButton = {
    setToggleSmallScreenMap,
    toggleSmallScreenMap,
  };
  // TODO: this reverts to column at 998 or something have to check
  return geolocations.features.length > 0 ? (
    <Box style={{ margin: "auto" }}>
      {/* <Flex
        mt={5}
        direction={{ base: "column", xs: "row", sm: "row", md: "row" }}
        gap={"sm"}
      >
        {geolocations.features.map((location, index) => {
          return (
            <LargeVPGeolocationCard
              key={index}
              location={location}
              {...geoLocationCardProps}
            />
          );
        })}
      </Flex>
      <Group mt={"sm"} position="center">
        <SmallScreenToggleMapButton {...smallScreenToggleMapButton} />
      </Group> */}
    </Box>
  ) : (
    <ErrorCard message="This location has no data" />
  );
};
