import * as React from "react";
import { Grid } from "@mantine/core";
import { MapContainer } from "./map-container";
import { ListContainer } from "./result-list";

// Mapbox needs a string as data source Id, layerId
const dataSourceId = "some id";
const layerId = "points";
// We have to explicitly type defination the data source otherwise mapObject.addSource tries to reach out URL by default and throws error
// Note: We can add any property to properties object. I have added index for easy manupulation in react. The Map object does generate a unique id
// We cannot use that id in react
export interface LocationPropertiesProps {
  title: string;
  description: string;
  index: number;
}

const testDataTwo: GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  LocationPropertiesProps
> = {
  features: [
    {
      type: "Feature",
      properties: {
        title: "Lincoln Park",
        description: "A northside park that is home to the Lincoln Park Zoo",
        index: 0,
      },
      geometry: {
        coordinates: [-87.637596, 41.940403],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Burnham Park",
        description: "A lakefront park on Chicago's south side",
        index: 1,
      },
      geometry: {
        coordinates: [-87.603735, 41.829985],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Millennium Park",
        description:
          "A downtown park known for its art installations and unique architecture",
        index: 2,
      },
      geometry: {
        coordinates: [-87.622554, 41.882534],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Grant Park",
        description:
          "A downtown park that is the site of many of Chicago's favorite festivals and events",
        index: 3,
      },
      geometry: {
        coordinates: [-87.619185, 41.876367],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Humboldt Park",
        description: "A large park on Chicago's northwest side",
        index: 4,
      },
      geometry: {
        coordinates: [-87.70199, 41.905423],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Douglas Park",
        description:
          "A large park near in Chicago's North Lawndale neighborhood",
        index: 5,
      },
      geometry: {
        coordinates: [-87.699329, 41.860092],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Calumet Park",
        description:
          "A park on the Illinois-Indiana border featuring a historic fieldhouse",
        index: 6,
      },
      geometry: {
        coordinates: [-87.530221, 41.715515],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Jackson Park",
        description:
          "A lakeside park that was the site of the 1893 World's Fair",
        index: 7,
      },
      geometry: {
        coordinates: [-87.580389, 41.783185],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Columbus Park",
        description: "A large park in Chicago's Austin neighborhood",
        index: 8,
      },
      geometry: {
        coordinates: [-87.769775, 41.873683],
        type: "Point",
      },
    },
  ],
  type: "FeatureCollection",
};
const testData: GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  LocationPropertiesProps
> = {
  features: [
    {
      type: "Feature",
      properties: {
        title: "Lincoln Park",
        description: "A northside park that is home to the Lincoln Park Zoo",
        index: 0,
      },
      geometry: {
        coordinates: [-87.637596, 41.940403],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Burnham Park",
        description: "A lakefront park on Chicago's south side",
        index: 1,
      },
      geometry: {
        coordinates: [-87.603735, 41.829985],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Millennium Park",
        description:
          "A downtown park known for its art installations and unique architecture",
        index: 2,
      },
      geometry: {
        coordinates: [-87.622554, 41.882534],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Grant Park",
        description:
          "A downtown park that is the site of many of Chicago's favorite festivals and events",
        index: 3,
      },
      geometry: {
        coordinates: [-87.619185, 41.876367],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Humboldt Park",
        description: "A large park on Chicago's northwest side",
        index: 4,
      },
      geometry: {
        coordinates: [-87.70199, 41.905423],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Douglas Park",
        description:
          "A large park near in Chicago's North Lawndale neighborhood",
        index: 5,
      },
      geometry: {
        coordinates: [-87.699329, 41.860092],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Calumet Park",
        description:
          "A park on the Illinois-Indiana border featuring a historic fieldhouse",
        index: 6,
      },
      geometry: {
        coordinates: [-87.530221, 41.715515],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Jackson Park",
        description:
          "A lakeside park that was the site of the 1893 World's Fair",
        index: 7,
      },
      geometry: {
        coordinates: [-87.580389, 41.783185],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Columbus Park",
        description: "A large park in Chicago's Austin neighborhood",
        index: 8,
      },
      geometry: {
        coordinates: [-87.769775, 41.873683],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Limit doneness lolss",
        description: "Test coordinate",
        index: 9,
      },
      geometry: {
        coordinates: [-0.12894, 51.52167],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "France lochness",
        description: "Test coordinate",
        index: 10,
      },
      geometry: {
        coordinates: [2.17967, 46.58635],
        type: "Point",
      },
    },
  ],
  type: "FeatureCollection",
};

export type activeMarkerProps = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  index: number | null;
};

export const PlacesDisplayComponent: React.FC = () => {
  const mapRef = React.useRef<any>();
  const [data, setData] = React.useState(testData);
  const [activePlace, setActivePlace] = React.useState<activeMarkerProps>({
    latitude: 0,
    longitude: 0,
    title: "",
    description: "",
    index: null,
  });
  const [showPopup, setShowPopup] = React.useState(false);

  const openPopup = (data: activeMarkerProps) => {
    setActivePlace({ ...data });
    setShowPopup(true);
  };

  const closePopUp = () => {
    setShowPopup(false);
    setActivePlace({
      latitude: 0,
      longitude: 0,
      title: "",
      description: "",
      index: null,
    });
  };
  // TODO: fix function we are updating
  const onUpdateData = (
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry, LocationPropertiesProps>
  ) => {
    setData(data);
  };

  return (
    <Grid>
      <Grid.Col md={6} lg={6}>
        <ListContainer
          locationData={data}
          openPopup={openPopup}
          closePopup={closePopUp}
          activePlace={activePlace}
          mapRef={mapRef}
          dataSourceId={dataSourceId}
          layerId={layerId}
        />
      </Grid.Col>
      <Grid.Col md={6} lg={6}>
        <MapContainer
          locationData={data}
          openPopup={openPopup}
          closePopup={closePopUp}
          showPopup={showPopup}
          activePlace={activePlace}
          mapRef={mapRef}
          dataSourceId={dataSourceId}
          layerId={layerId}
          setData={onUpdateData}
        />
      </Grid.Col>
    </Grid>
  );
};
