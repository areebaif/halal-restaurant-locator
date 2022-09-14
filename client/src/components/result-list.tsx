import * as React from "react";
import { MapProps } from "./map-container";
import { List, Menu, Popover, Text } from "@mantine/core";

import { activeMarkerProps } from "./map-layout";

export const LocationCard: React.FC<{
  showCard: boolean;
  openCard: () => void;
  closeCard: () => void;
}> = ({ showCard, openCard, closeCard }) => {
  return <Menu opened={showCard} onChange={closeCard}></Menu>;
};

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
    openPopup(data);
    mapRef.current.setFeatureState(
      { source: dataSourceId, id: data.index },
      { hover: true }
    );
  };

  const allListMouseLeave = () => {
    // disable hover interactivity on map
    mapRef.current.setFeatureState(
      { source: dataSourceId, id: activePlace.index },
      { hover: false }
    );
    closePopup();
  };
  return (
    <List onMouseLeave={allListMouseLeave} icon={" "}>
      {locationData.features.map((item) => {
        const coordinatesObject = item.geometry as GeoJSON.Point;
        const [longitude, latitude] = coordinatesObject.coordinates;
        const { title, description, index } = item.properties;

        return (
          <Popover
            opened={showCard}
            onChange={closeCard}
            //
            offset={30}
          >
            <Popover.Target>
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
                    { source: dataSourceId, id: activePlace.index },
                    { hover: false }
                  );

                  closePopup();
                }}
                key={item.properties?.index}
              >
                {item.properties?.title}: {item.properties?.description}{" "}
              </List.Item>
            </Popover.Target>

            <Popover.Dropdown>
              <Text>hello</Text>
            </Popover.Dropdown>
          </Popover>
        );
      })}
    </List>
  );
};
