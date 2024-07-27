import * as React from "react";

import { Flex, Box, Card, Image, Title, Text, ScrollArea } from "@mantine/core";
import { ErrorCard } from "../../..";
import { MapContainerProps } from "../../map/MapContainer";
import { LargeVPGeolocationCard } from "./LargeVPSearchResultRestaurantCard";

export const LargeVPSearchResultList: React.FC<MapContainerProps> = ({
  geolocations,
  hoverId,
  setHoverId,
  showPopup,
  setShowPopup,
  popupData,
  setPopupData,
}) => {
  const geoLocationCardProps = {
    hoverId,
    setHoverId,
    showPopup,
    setShowPopup,
    popupData,
    setPopupData,
  };

  return geolocations.features.length > 0 ? (
    <Flex mt={5} direction={"column"}>
      <ScrollArea offsetScrollbars type="always" h={600}>
        {geolocations.features.map((location, index) => {
          return (
            <>
              <LargeVPGeolocationCard
                key={index}
                location={location}
                {...geoLocationCardProps}
              />
            </>
          );
        })}
      </ScrollArea>
    </Flex>
  ) : (
    <ErrorCard message="This location has no data" />
  );
};
