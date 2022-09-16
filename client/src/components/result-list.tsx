import * as React from "react";
import { MapProps } from "./map-container";
import { List, Popover, Text, CloseButton } from "@mantine/core";

import { activeMarkerProps } from "./map-layout";
let hoverId: null | number = null;

export const ListContainer: React.FC<MapProps> = ({
  dataSource,
  activePlace,
  mapRef,
  dataSourceId,
  showCard,
  openCard,
  closeCard,
  showCardData,
  setActivePlaceData,
}) => {
  console.log("hello I am showcard", showCard);
  const onMouseEnter = (data: activeMarkerProps) => {
    if (hoverId) {
      mapRef.current.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
    }
    hoverId = null;
    hoverId = data.index;
    setActivePlaceData?.(data);
    mapRef.current.setFeatureState(
      { source: dataSourceId, id: hoverId },
      { hover: true }
    );
  };

  const allListMouseLeave = () => {
    // disable hover interactivity on map
    mapRef.current.setFeatureState(
      { source: dataSourceId, id: hoverId },
      { hover: false }
    );
    hoverId = null;
    // close Popup
    setActivePlaceData?.();
  };

  const list = (
    <List onMouseLeave={allListMouseLeave} icon={" "}>
      {dataSource.features.map((item) => {
        const coordinatesObject = item.geometry as GeoJSON.Point;
        const [longitude, latitude] = coordinatesObject.coordinates;
        const { title, description, index } = item.properties;

        return (
          <List.Item
            onMouseEnter={() =>
              onMouseEnter({
                title,
                description,
                index,
                longitude,
                latitude,
              })
            }
            onClick={() => openCard?.(activePlace)}
            onMouseLeave={() => {
              mapRef.current.setFeatureState(
                { source: dataSourceId, id: hoverId },
                { hover: false }
              );
              hoverId = null;
              // close Popup
              setActivePlaceData?.();
            }}
            key={item.properties?.index}
          >
            {item.properties?.title}: {item.properties?.description}{" "}
          </List.Item>
        );
      })}
    </List>
  );

  return (
    <Popover opened={showCard} position={"right"} offset={20} withArrow={true}>
      <Popover.Target>{list}</Popover.Target>
      <Popover.Dropdown>
        <CloseButton onClick={() => closeCard?.()} aria-label="Close modal" />
        <Text>{showCardData?.index}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};
