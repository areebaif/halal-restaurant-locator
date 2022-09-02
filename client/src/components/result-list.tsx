import * as React from "react";
import { MapProps } from "./map-container";
import { List } from "@mantine/core";
import { activeMarkerProps } from "./map-layout";

export const ListContainer: React.FC<MapProps> = ({
  locationData,
  openPopup,
  closePopup,
  activePlace,
  mapRef,
  dataSourceId,
}) => {
  const onMouseEnter = (data: activeMarkerProps) => {
    mapRef.current.setFeatureState(
      { source: dataSourceId, id: data.index },
      { hover: true }
    );
    openPopup(data);
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
          <List.Item
            onMouseEnter={() =>
              onMouseEnter({ title, description, index, longitude, latitude })
            }
            onMouseLeave={() => {
              mapRef.current.setFeatureState(
                { source: dataSourceId, id: activePlace.index },
                { hover: false }
              );
            }}
            key={item.properties?.index}
          >
            {item.properties?.title}: {item.properties?.description}{" "}
          </List.Item>
        );
      })}
    </List>
  );
};
