import * as React from "react";
import { MapProps } from "./map-container";
import { List, Menu, Popover, Text } from "@mantine/core";

import { activeMarkerProps } from "./map-layout";
let hoverId: null | number = null;

export const ListContainer: React.FC<MapProps> = ({
  locationData,
  openPopup,
  closePopup,
  activePlace,
  mapRef,
  dataSourceId,
  showCard,
  openCard,
  closeCard,
}) => {
  const onMouseEnter = (data: activeMarkerProps) => {
    if (hoverId) {
      mapRef.current.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
    }
    hoverId = null;
    hoverId = data.index;
    openPopup(data);
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
    closePopup();
  };

  const list = (
    <List onMouseLeave={allListMouseLeave} icon={" "}>
      {locationData.features.map((item) => {
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
            onMouseLeave={() => {
              mapRef.current.setFeatureState(
                { source: dataSourceId, id: hoverId },
                { hover: false }
              );
              hoverId = null;
              // close Popup
              closePopup();
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
    <Popover
      opened={showCard}
      onChange={closeCard}
      position={"right"}
      offset={20}
      withArrow={true}
    >
      <Popover.Target>{list}</Popover.Target>
      <Popover.Dropdown>
        <Text>hello</Text>
      </Popover.Dropdown>
    </Popover>
  );
};
