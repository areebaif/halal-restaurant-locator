import * as React from "react";
import { Grid } from "@mantine/core";
import { useQuery } from "react-query";
import { MapContainer } from "./map-container";
import { ListContainer } from "./result-list";
import { AutoCompleteInput } from "./search-component";

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
}

// Mapbox needs a string as data source Id, layerId
const dataSourceId = "some id";
const layerId = "points";

export interface SearchTerms {
  zipcodeUserInput: string | null;
  cityUserInput: string | null;
  stateUserInput: string | null;
  nameUserInput?: string | null;
}

// This data has london points
const testData: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> = {
  features: [
    {
      type: "Feature",
      properties: {
        title: "Lincoln Park",
        description: "A northside park that is home to the Lincoln Park Zoo",
      },
      geometry: {
        coordinates: [-87.637596, 41.940403],
        type: "Point",
      },
      id: 0,
    },
    {
      type: "Feature",
      properties: {
        title: "Burnham Park",
        description: "A lakefront park on Chicago's south side",
      },
      geometry: {
        coordinates: [-87.603735, 41.829985],
        type: "Point",
      },
      id: 1,
    },
    {
      type: "Feature",
      properties: {
        title: "Millennium Park",
        description:
          "A downtown park known for its art installations and unique architecture",
      },
      geometry: {
        coordinates: [-87.622554, 41.882534],
        type: "Point",
      },
      id: 2,
    },
    {
      type: "Feature",
      properties: {
        title: "Grant Park",
        description:
          "A downtown park that is the site of many of Chicago's favorite festivals and events",
      },
      geometry: {
        coordinates: [-87.619185, 41.876367],
        type: "Point",
      },
      id: 3,
    },
    {
      type: "Feature",
      properties: {
        title: "Humboldt Park",
        description: "A large park on Chicago's northwest side",
      },
      geometry: {
        coordinates: [-87.70199, 41.905423],
        type: "Point",
      },
      id: 4,
    },
    {
      type: "Feature",
      properties: {
        title: "Douglas Park",
        description:
          "A large park near in Chicago's North Lawndale neighborhood",
      },
      geometry: {
        coordinates: [-87.699329, 41.860092],
        type: "Point",
      },
      id: 5,
    },
    {
      type: "Feature",
      properties: {
        title: "Calumet Park",
        description:
          "A park on the Illinois-Indiana border featuring a historic fieldhouse",
      },
      geometry: {
        coordinates: [-87.530221, 41.715515],
        type: "Point",
      },
      id: 6,
    },
    {
      type: "Feature",
      properties: {
        title: "Jackson Park",
        description:
          "A lakeside park that was the site of the 1893 World's Fair",
      },
      geometry: {
        coordinates: [-87.580389, 41.783185],
        type: "Point",
      },
      id: 7,
    },
    {
      type: "Feature",
      properties: {
        title: "Columbus Park",
        description: "A large park in Chicago's Austin neighborhood",
      },
      geometry: {
        coordinates: [-87.769775, 41.873683],
        type: "Point",
      },
      id: 8,
    },
    {
      type: "Feature",
      properties: {
        title: "Limit doneness lolss",
        description: "Test coordinate",
      },
      geometry: {
        coordinates: [-0.12894, 51.52167],
        type: "Point",
      },
      id: 9,
    },
    {
      type: "Feature",
      properties: {
        title: "France lochness",
        description: "Test coordinate",
      },
      geometry: {
        coordinates: [2.17967, 46.58635],
        type: "Point",
      },
      id: 10,
    },
  ],
  type: "FeatureCollection",
};

export interface activeMarkerProps {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  index: number | undefined | string;
}

export const PlacesDisplayComponent: React.FC = () => {
  const mapRef = React.useRef<any>();
  const [mapData, setMapData] =
    React.useState<
      GeoJSON.FeatureCollection<GeoJSON.Geometry, PropertiesProps>
    >();
  const [activePlace, setActivePlace] = React.useState<activeMarkerProps>({
    latitude: 0,
    longitude: 0,
    title: "",
    description: "",
    index: undefined,
  });
  const [locationInfoCard, setLocationInfoCard] = React.useState(false);
  const [locationInfoCardData, setLocationInfoCardData] =
    React.useState<activeMarkerProps>({
      latitude: 0,
      longitude: 0,
      title: "",
      description: "",
      index: undefined,
    });
  const [zipcodeUserInput, setZipcodeUserInput] = React.useState("");
  const [errorZipcodeUserInput, setErrorZipcodeUserInput] =
    React.useState(false);
  const [cityUserInput, setCityUserInput] = React.useState("");
  const [errorCityUserInput, setErrorCityUserInput] = React.useState(false);
  const [stateUserInput, setStateUserInput] = React.useState("");
  const [errorStateUserInput, setErrorStateUserInput] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<SearchTerms>({
    zipcodeUserInput: null,
    cityUserInput: null,
    stateUserInput: null,
    nameUserInput: null,
  });

  // Fetching Data
  const URL = "/api/dev/data";
  const { isLoading, isError, data, error } = useQuery(
    "getAllLocations",
    async () => {
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: {
        data: GeoJSON.FeatureCollection<GeoJSON.Geometry, PropertiesProps>;
      } = await response.json();
      return data.data;
    },
    {
      onSuccess: (data) => {
        // TODO: fix this that only search term is sent depending on what the search term is
        // do some data manuplulation to only set Chicago Data. There are too many data points
        const filteredValues = data?.features?.filter((item: any) => {
          return item.properties.city === "Chicago";
        });

        const mapLocations: GeoJSON.FeatureCollection<
          GeoJSON.Geometry,
          PropertiesProps
        > = {
          type: "FeatureCollection",
          features: filteredValues?.length ? filteredValues : [],
        };
        setMapData(mapLocations);
      },
    }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: error occured</span>;
  }

  const onStateUserInputChange = (value: string) => {
    // Check for special characters including numbers
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);

    if (!specialCharsTest) {
      setErrorStateUserInput(false);
      setStateUserInput(value);
    } else {
      setErrorStateUserInput(true);
      setStateUserInput(value);
    }
  };

  const onCityUserInputChange = (value: string) => {
    // Check for special characters including numbers (dont check for white spaces some cities are two words with whote space in between)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);
    if (!specialCharsTest) {
      setErrorCityUserInput(false);
      setCityUserInput(value);
    } else {
      setErrorCityUserInput(true);
      setCityUserInput(value);
    }
  };

  const onZipcodeUserInputChange = (value: string) => {
    // check for white spaces in zipcode
    const specialChars = /[ ]/;
    const expression = true;
    switch (expression) {
      case specialChars.test(value):
        setErrorZipcodeUserInput(true);
        setZipcodeUserInput(value);
        break;
      case isNaN(Number(value)):
        setErrorZipcodeUserInput(true);
        setZipcodeUserInput(value);
        break;
      default:
        setErrorZipcodeUserInput(false);
        setZipcodeUserInput(value);
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
        index: undefined,
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
      index: undefined,
    });
  };

  const onSearch = (data: SearchTerms) => {
    // You will either have zipcode, or state or city and state
    const { zipcodeUserInput, cityUserInput, stateUserInput, nameUserInput } =
      data;
    if (zipcodeUserInput?.length) {
      // trigger search for zipcode and reset all values
    }

    if (stateUserInput?.length && cityUserInput?.length) {
      // trigger search for state and city and reset all values
    }

    if (stateUserInput?.length && !cityUserInput?.length) {
      // trigger search for state and reset all values
    }

    if (nameUserInput?.length) {
      // trigger search for name and reset all values
    }

    console.log(data);
    //const { zipcode, cityValue, stateValue, name } = data;
    // TODO: either trigger search or filter data set??
  };

  const onSeacrhQuery = (
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry, any>
  ) => {
    setMapData(data);
  };

  return mapData ? (
    <Grid>
      <Grid.Col md={12} lg={12}>
        <AutoCompleteInput
          zipcodeUserInput={zipcodeUserInput}
          onZipcodeUserInputChange={onZipcodeUserInputChange}
          errorZipcodeUserInput={errorZipcodeUserInput}
          cityUserInput={cityUserInput}
          onCityUserInputChange={onCityUserInputChange}
          errorCityUserInput={errorCityUserInput}
          stateUserInput={stateUserInput}
          onStateUserInputChange={onStateUserInputChange}
          errorStateUserInput={errorStateUserInput}
          onSearch={onSearch}
        />
      </Grid.Col>
      <Grid.Col md={6} lg={6}>
        <ListContainer
          dataSource={mapData}
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
          dataSource={mapData}
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
  ) : (
    <div>loading</div>
  );
};
