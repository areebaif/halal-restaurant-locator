import * as React from "react";
import { Grid } from "@mantine/core";
import { MapContainer } from "./map-container";
import { ListContainer } from "./result-list";
import { AutoCompleteInput } from "./search-component";

import rawLocations from "../location.json";

// https://simplemaps.com/data/us-zips this need to be added to usa zipcode data

// This is for setting filter
// Chip.Group controlled cip group for multi filter select for search
// transfer list for a card generation

export interface PropertiesProps {
  title: string;
  city: string;
  state_id: string;
  state: string;
  zip: string;
  index: number;
}
export interface FeatureDocument {
  type: string;
  properties: PropertiesProps;
  geometry: { coordinates: [number, number]; type: "Point" };
}
export interface RawData {
  features: FeatureDocument[];
}
const allRawData: RawData = JSON.parse(JSON.stringify(rawLocations));

// we need to remove duplicate city values
const citySet: Set<string> = new Set();
const stateSet: Set<string> = new Set();

// We are combining city,state here and adding entries to set
const formattedData = allRawData.features.map((item: FeatureDocument) => {
  const properties = item.properties;
  citySet.add(properties.city);
  stateSet.add(properties.state);
  return { ...item, city_state: `${properties.city}, ${properties.state}` };
});

// Mapbox needs a string as data source Id, layerId
const dataSourceId = "some id";
const layerId = "points";

// Note: We can add any property to properties object. I have added index for easy manupulation in react. The Map object does generate a unique id
// We cannot use that id in react
// TODO: These are throw away properties prop
export interface LocationPropertiesProps {
  title: string;
  description: string;
  index: number;
}
export interface SearchTerms {
  zipcode: string | null;
  cityValue: string | null;
  stateValue: string | null;
  name: string | null;
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

// This data has london points
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

export interface activeMarkerProps {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  index: number | null;
}

export const PlacesDisplayComponent: React.FC = () => {
  const mapRef = React.useRef<any>();
  const [data, setData] = React.useState(testDataTwo);
  const [activePlace, setActivePlace] = React.useState<activeMarkerProps>({
    latitude: 0,
    longitude: 0,
    title: "",
    description: "",
    index: null,
  });
  const [locationInfoCard, setLocationInfoCard] = React.useState(false);
  const [locationInfoCardData, setLocationInfoCardData] =
    React.useState<activeMarkerProps>({
      latitude: 0,
      longitude: 0,
      title: "",
      description: "",
      index: null,
    });
  const [zipcode, setZipcode] = React.useState("");
  const [errorZipcode, setErrorZipcode] = React.useState(false);
  const [cityValue, setCity] = React.useState("");
  const [errorCity, setErrorCity] = React.useState(false);
  const [stateValue, setStateValue] = React.useState("");
  const [errorState, setErrorState] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<{
    zipcode: string | null;
    cityValue: string | null;
    stateValue: string | null;
    name: string | null;
  }>({
    zipcode: null,
    cityValue: null,
    stateValue: null,
    name: null,
  });

  const onStateValueChange = (value: string) => {
    // Check for special characters including numbers
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);

    if (!specialCharsTest) {
      setErrorState(false);
      setStateValue(value);
    } else {
      setErrorState(true);
      setStateValue(value);
    }
  };

  const onCityValueChange = (value: string) => {
    // Check for special characters including numbers (dont check for white spaces some cities are two words with whote space in between)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);
    if (!specialCharsTest) {
      setErrorCity(false);
      setCity(value);
    } else {
      setErrorCity(true);
      setCity(value);
    }
  };

  const onZipcodeValueChange = (value: string) => {
    // check for white spaces in zipcode
    const specialChars = /[ ]/;
    const expression = true;
    switch (expression) {
      case specialChars.test(value):
        setErrorZipcode(true);
        setZipcode(value);
        break;
      case isNaN(Number(value)):
        setErrorZipcode(true);
        setZipcode(value);
        break;
      default:
        setErrorZipcode(false);
        setZipcode(value);
    }
  };

  const setActivePlaceData = (data: activeMarkerProps | null) => {
    if (data) {
      setActivePlace({ ...data });
    } else {
      // defualt case when no location selected
      setActivePlace({
        latitude: 0,
        longitude: 0,
        title: "",
        description: "",
        index: null,
      });
    }
  };

  const onLocationInfoOpenCard = (data: activeMarkerProps) => {
    setLocationInfoCardData(data);
    setLocationInfoCard(true);
  };

  const onLocationInfoCloseCard = () => {
    setLocationInfoCard(false);
    setLocationInfoCardData({
      latitude: 0,
      longitude: 0,
      title: "",
      description: "",
      index: null,
    });
  };

  const onSearch = (data: SearchTerms) => {
    const {zipcode, cityValue, stateValue, name} = data
    // TODO: either trigger search or filter data set??
  }

  const onSeacrhQuery = (
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry, LocationPropertiesProps>
  ) => {
    setData(data);
  };

  return (
    <Grid>
      <Grid.Col md={12} lg={12}>
        <AutoCompleteInput
          zipcodeValue={zipcode}
          onZipcodeChange={onZipcodeValueChange}
          errorZipcode={errorZipcode}
          cityValue={cityValue}
          onCityValueChange={onCityValueChange}
          errorCity={errorCity}
          stateValue={stateValue}
          onStateValueChange={onStateValueChange}
          errorState={errorState}
          citySet={citySet}
          stateSet={stateSet}
          zipData={formattedData}
        />
      </Grid.Col>
      <Grid.Col md={6} lg={6}>
        <ListContainer
          dataSource={data}
          dataSourceId={dataSourceId}
          mapRef={mapRef}
          layerId={layerId}
          activePlace={activePlace}
          setActivePlaceData={setActivePlaceData}
          locationInfoCard={locationInfoCard}
          locationInfoCardData={locationInfoCardData}
          onLocationInfoOpenCard={onLocationInfoOpenCard}
          onLocationInfoCloseCard={onLocationInfoCloseCard}
        />
      </Grid.Col>
      <Grid.Col md={6} lg={6}>
        <MapContainer
          dataSource={data}
          dataSourceId={dataSourceId}
          mapRef={mapRef}
          layerId={layerId}
          activePlace={activePlace}
          setActivePlaceData={setActivePlaceData}
          onLocationInfoOpenCard={onLocationInfoOpenCard}
          onSearch={onSeacrhQuery}
        />
      </Grid.Col>
    </Grid>
  );
};
