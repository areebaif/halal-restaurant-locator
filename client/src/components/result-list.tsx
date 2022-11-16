import * as React from "react";
import { MapProps } from "./map-container";
import {
  List,
  Popover,
  Text,
  CloseButton,
  Box,
  ScrollArea,
} from "@mantine/core";

import { activeMarkerProps } from "./search-mapdisplay";

// We need this varibale to sync map id data with react and its local to this file
let hoverId: string | undefined | number = undefined;

export const ListContainer: React.FC<MapProps> = ({
  dataSource,
  dataSourceId,
  mapRef,
  activePlace,
  setActivePlaceData,
  locationInfoCard,
  onLocationInfoOpenCard,
  onLocationInfoCloseCard,
  locationInfoCardData,
}) => {
  const onMouseEnter = (data: activeMarkerProps) => {
    if (hoverId) {
      mapRef.current.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
    }
    hoverId = undefined;
    hoverId = data.index;
    setActivePlaceData?.(data);
    mapRef.current.setFeatureState(
      { source: dataSourceId, id: hoverId },
      { hover: true }
    );
  };

  const allListMouseLeave = () => {
    // disable hover interactivity on map
    if (hoverId) {
      mapRef.current.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
    }
    hoverId = undefined;
    // close Popup
    setActivePlaceData?.(null);
  };

  const list = (
    <Box>
      <ScrollArea style={{ height: 600 }} type="auto">
        <List onMouseLeave={allListMouseLeave} icon={" "}>
          {dataSource.features.map((item) => {
            const coordinatesObject = item.geometry as GeoJSON.Point;
            const [longitude, latitude] = coordinatesObject.coordinates;
            const { title } = item.properties;
            const id = item.id;

            return (
              <List.Item
                onMouseEnter={() =>
                  onMouseEnter({
                    title,
                    description: "no description",
                    index: id,
                    longitude,
                    latitude,
                  })
                }
                onClick={() => onLocationInfoOpenCard?.(activePlace)}
                onMouseLeave={() => {
                  mapRef.current.setFeatureState(
                    { source: dataSourceId, id: hoverId },
                    { hover: false }
                  );
                  hoverId = undefined;
                  // close Popup
                  setActivePlaceData?.(null);
                }}
                key={item.id}
              >
                {item.properties?.title}
              </List.Item>
            );
          })}
        </List>
      </ScrollArea>
    </Box>
  );

  return (
    <Popover
      opened={locationInfoCard}
      position={"right"}
      offset={20}
      withArrow={true}
    >
      <Popover.Target>{list}</Popover.Target>
      <Popover.Dropdown>
        <CloseButton
          onClick={() => onLocationInfoCloseCard?.()}
          aria-label="Close modal"
        />
        <Text>{locationInfoCardData?.index}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};
