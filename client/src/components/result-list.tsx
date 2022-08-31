import * as React from "react";
import { MapProps } from "./map-container";
import { List } from "@mantine/core";
import { activeMarkerProps } from "./map-layout";

// type: "Feature",
//       properties: {
//         title: "Lincoln Park",
//         description: "A northside park that is home to the Lincoln Park Zoo",
//         index: 0,
//       },
//       geometry: {
//         coordinates: [-87.637596, 41.940403],
//         type: "Point",
//       }

// export type activeMarkerProps = {
//   latitude: number;
//   longitude: number;
//   title: string;
//   description: string;
//   index: number | undefined;
// };

export const ListContainer: React.FC<MapProps> = ({
  locationData,
  openPopup,
  closePopup,
  activePlace,
  showPopup,
}) => {
  const onMouseEnter = (data: activeMarkerProps) => {
    openPopup(data);
    //const { title, description, index, longitude, latitude } = data;

    //console.log(title, description, index, longitude, latitude);
  };

  const allListMouseLeave = () => {
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
            onMouseLeave={() =>
              console.log("I just left", item.properties?.index)
            }
            key={item.properties?.index}
          >
            {item.properties?.title}: {item.properties?.description}{" "}
          </List.Item>
        );
      })}
    </List>
  );
};
