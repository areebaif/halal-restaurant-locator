import * as React from "react";
import { Grid } from "@mantine/core";
import { useQuery } from "react-query";
import { MapContainer } from "./map-container";
import { ListContainer } from "./result-list";
import { AutoCompleteInput } from "./search-component";
import { fetchZipSearch } from "../BackendFunc-DataCalc/backendFunctions";

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

export interface CameraViewState {
  latitude: number;
  longitude: number;
  zoom?: number;
}

// Mapbox needs a string as data source Id, layerId
const dataSourceId = "some id";
const layerId = "points";

// this is used to send searchterms with specified data to backend
export interface BackendSearchTerms {
  zipcode: { id: BigInteger; name: string } | undefined;
  city: { id: BigInteger; name: string } | undefined;
  state: { id: BigInteger; name: string } | undefined;
  restaurantName: { id: BigInteger; name: string } | undefined;
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

export const SearchAndMapDisplayComponent: React.FC = () => {
  // Map Props
  const mapRef = React.useRef<any>();
  const [mapData, setMapData] =
    React.useState<
      GeoJSON.FeatureCollection<GeoJSON.Geometry, PropertiesProps>
    >();
  const [cameraViewState, setCameraViewState] =
    React.useState<CameraViewState>();
  const [refreshMapData, setRefreshMapData] = React.useState(false);
  // Map Marker Information Props
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
  // User Input Props
  const [zipcodeUserInput, setZipcodeUserInput] = React.useState("");
  const [errorZipcodeUserInput, setErrorZipcodeUserInput] =
    React.useState(false);
  const [cityUserInput, setCityUserInput] = React.useState("");
  const [errorCityUserInput, setErrorCityUserInput] = React.useState(false);
  const [stateUserInput, setStateUserInput] = React.useState("");
  const [errorStateUserInput, setErrorStateUserInput] = React.useState(false);
  const [restaurantNameUserInput, setRestaurantNameUserInput] =
    React.useState("");

  // backend api props based on user input
  const [backendSearchTerms, setBackendSearchTerms] =
    React.useState<BackendSearchTerms>({
      zipcode: undefined,
      city: undefined,
      state: undefined,
      restaurantName: undefined,
    });
  // flags to call backend api
  const [zipBackendApiFlag, setZipBackendApiFlag] = React.useState(false);
  const [stateBackendApiFlag, setStateBackendApiFlag] = React.useState(false);
  const [cityBackendApiFlag, setCityBackendApiFlag] = React.useState(false);
  const [restaurantBackendApiFlag, setRestaurantBackendApiFlag] =
    React.useState(false);
  //clientKeys =
  //TODO: extract out data fetching functions put them in a separate file
  // Data fetching
  const URL = "/api/dev/data";
  // TODO: name this query and extract isLoading functions etc
  const chicagoLocations = useQuery(
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
        // TODO: You have to also set camera angle depending on what the user has searched, right now we are hardcoding
        setCameraViewState({ latitude: 41.45, longitude: -88.53, zoom: 7.2 });
        console.log("I was ran on sucess");
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
  // Depending on what the user is searching, these functions trigger a backedn API call and set map data and map camera according to search results
  const zipCodeSearchResult = useQuery(
    ["getZipCodeSearch", zipcodeUserInput],
    () => fetchZipSearch(zipcodeUserInput),
    {
      enabled: false,
      onSuccess: (data) => {
        console.log("data");
        const mapLocations: GeoJSON.FeatureCollection<
          GeoJSON.Geometry,
          PropertiesProps
        > = {
          type: "FeatureCollection",
          features: data.length ? data : [],
        };
        setMapData(mapLocations);
        setRefreshMapData(true);
        setZipcodeUserInput("");
      },
    }
  );

  // const zipCodeSearchResult = useQuery(
  //   ["getZipCodeSearchTest", backendSearchTerms.zipcode?.name],
  //   () => fetchZipSearch(backendSearchTerms.zipcode?.name),
  //   {
  //     enabled:
  //       zipBackendApiFlag &&
  //       !stateBackendApiFlag &&
  //       !cityBackendApiFlag &&
  //       !restaurantBackendApiFlag,
  //     onSuccess: (data) => {
  //       setZipBackendApiFlag(false);
  //       const mapLocations: GeoJSON.FeatureCollection<
  //         GeoJSON.Geometry,
  //         PropertiesProps
  //       > = {
  //         type: "FeatureCollection",
  //         features: data.length ? data : [],
  //       };
  //       setMapData(mapLocations);
  //       setRefreshMapData(true);
  //       setZipcodeUserInput("");
  //       onBackendSearchTermChange({
  //         zipcode: undefined,
  //       });
  //     },
  //   }
  // );

  if (chicagoLocations.isLoading) {
    return <span>Loading...</span>;
  }

  if (chicagoLocations.isError || zipCodeSearchResult.isError) {
    //setZipBackendApiFlag(false);
    return <span>Error: error occured</span>;
  }

  const onCameraViewStateChange = (data: CameraViewState) => {
    setCameraViewState((previousState) => {
      return { ...previousState, ...data };
    });
  };

  const onRestaurantNameInputChange = (value: string) => {
    console.log("restaurantVqaluex", value);
    setRestaurantNameUserInput(value);
  };

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

  const refreshDataMap = () => {
    setRefreshMapData(false);
  };
  const onBackendSearchTermChange = (data: { [key: string]: any }) => {
    // If you are doing updates in a row on object properties, then you need previous state function
    setBackendSearchTerms((previousState) => {
      return { ...previousState, ...data };
    });
  };

  const callZipBackendApi = () => {
    setZipBackendApiFlag(true);
  };

  const callStateBackendApi = () => {
    setStateBackendApiFlag(true);
  };

  const callCityBackendApi = () => {
    setCityBackendApiFlag(true);
  };

  const callRestaurantBackendApi = () => {
    setRestaurantBackendApiFlag(true);
  };
  //console.log(zipcodeUserInput, zipBackendApiFlag, backendSearchTerms);
  const onSearch = (data = backendSearchTerms) => {
    // You will either have zipcode, or state or city and state or name
    //if (!searchFlag) return;

    const { zipcode, city, state, restaurantName } = data;
    console.log("onsearch", data);
    setZipcodeUserInput(zipcodeUserInput!);

    // using switch to break the program execution when a usecase is hit otherwise I have to write all possible combinations/permutaions in if statements
    // if statements do not break program execution for example: restaurant, city and state input will also trigger state and city input in if statements.

    // we have already checked and set the terms we want to send to backend so trigger backend call based on these switch cases
    switch (true) {
      // restaurantName, zipcode
      case Boolean(restaurantName?.id) &&
        Boolean(zipcode?.id) &&
        Boolean(!state?.id) &&
        Boolean(!city?.id):
        console.log(" at restaurant zipcode no state");
        break;
      //restaurantName, state
      case Boolean(restaurantName?.id) &&
        Boolean(state?.id) &&
        Boolean(!zipcode?.id) &&
        Boolean(!city?.id):
        console.log("restaurant, state, nop zip");
        break;
      //restaurantName, state, city
      case Boolean(restaurantName?.id) &&
        Boolean(state?.id) &&
        Boolean(city?.id) &&
        Boolean(!zipcode?.id):
        console.log("restaurant,state,city,nozip");
        break;
      //restaurantName
      case Boolean(restaurantName?.id) &&
        Boolean(!state?.id) &&
        Boolean(!city?.id) &&
        Boolean(!zipcode?.id):
        console.log("only restaurant");
        break;
      // zipcode
      case Boolean(zipcode?.id) &&
        Boolean(!state?.id) &&
        Boolean(!city?.id) &&
        Boolean(!restaurantNameUserInput):
        console.log(" only zipcode");
        setZipcodeUserInput(zipcodeUserInput!);
        break;
      // state,city
      case Boolean(state?.id) &&
        Boolean(city?.id) &&
        Boolean(!zipcode?.id) &&
        Boolean(!restaurantName?.id):
        console.log("state and city no zipcode");
        break;
      // state
      case Boolean(state?.id) &&
        Boolean(!city?.id) &&
        Boolean(!zipcode?.id) &&
        Boolean(!restaurantName?.id):
        console.log("only state no city no zipcode"); // no zipcode
        break;
      // TODO: error handling this means user didnt enter anything and submitted
      default:
        console.log("error");
    }
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
          restaurantNameUserInput={restaurantNameUserInput}
          onRestaurantNameUserInputChange={onRestaurantNameInputChange}
          backendSearchTerms={backendSearchTerms}
          onBackendSearchTermChange={onBackendSearchTermChange}
          callZipBackendApi={callZipBackendApi}
          callStateBackendApi={callStateBackendApi}
          callCityBackendApi={callCityBackendApi}
          callRestaurantBackendApi={callRestaurantBackendApi}
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
          RefreshMapData={refreshMapData}
          setRefreshMapData={refreshDataMap}
          cameraViewState={cameraViewState}
          onViewStateChange={onCameraViewStateChange}
          //onSearch={onSeacrhQuery}
        />
      </Grid.Col>
    </Grid>
  ) : (
    <div>loading</div>
  );
};
