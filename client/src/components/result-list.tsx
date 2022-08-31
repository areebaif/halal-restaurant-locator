import * as React from "react";
import { MapProps } from "./map-container";
import { List } from "@mantine/core";

export const ListContainer: React.FC<MapProps> = ({
  locationData,
  openPopup,
  closePopup,
  activePlace,
  showPopup,
}) => {
  return (
    <List>
      {locationData.features.map((item) => (
        <List.Item
          onMouseEnter={() => console.log("I ws here", item.properties?.index)}
          onMouseLeave={() =>
            console.log("I just left", item.properties?.index)
          }
          key={item.properties?.index}
        >
          {item.properties?.title}: {item.properties?.description}{" "}
        </List.Item>
      ))}
    </List>
  );
};
