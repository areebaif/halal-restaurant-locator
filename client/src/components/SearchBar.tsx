import * as React from "react";
import { Autocomplete, AutocompleteItem, Group, Button } from "@mantine/core";
import { useQuery } from "react-query";
import * as ReactRouter from "react-router-dom";
import { MapBoxMap } from "./map";

import { validateUserInput } from "../BackendFunc-DataCalc/userInput";
import {
  fetchZipSearch,
  fetchAutoCompleteData,
  ZipDocument,
  RestaurantDocument,
  CityDocument,
  StateDocument,
  FetchAutomplete,
  fetchStateSearch,
  fetchStateAndCitySearch,
} from "../BackendFunc-DataCalc/backendFunctions";
import { useAppDispatch, useAppSelector } from "../redux-store/redux-hooks";
import {
  onCityBackendInputChange,
  onRestaurantdeBackendInputChange,
  onStateBackendInputChange,
  onZipCodeBackendInputChange,
  onFetchRestaurant,
  onFetchRestaurantState,
  onFetchRestaurantStateCity,
  onFetchRestaurantZipcode,
  onFetchState,
  onFetchStateCity,
  onFetchZipcode,
} from "../redux-store/search-slice";

import {
  onGoelocationDataChange,
  onRefreshMapDataChange,
  //onRefreshMapDataChange,
} from "../redux-store/geolocation-slice";
import { stateDocument } from "./search-component";

export interface PropertiesProps {
  title: string;
  city: string;
  state_id: string;
  state: string;
  zip: string;
}

export const SearchBar: React.FC<{}> = () => {
  // we are setting state, city, zip and restaurant data to validate user input with backend returned values of state, city, zipcode or restaurantName
  // We are setting these values to avoid unnecessary calls to backend if user enters an invalid value. Some hosting solutions charges money for api calls
  // additionally validating user input early reduces latency
  // We are using front-end and back-end data rules to validate user input.
  const [stateData, setStateData] = React.useState<StateDocument[]>();
  const [cityData, setCityData] = React.useState<CityDocument[]>();
  const [zipData, setZipData] = React.useState<ZipDocument[]>();
  const [restaurantData, setRestaurantData] =
    React.useState<RestaurantDocument[]>();
  const [autoCompleteData, setAutoCompleteData] = React.useState<string[]>();
  const [userInput, setUserInput] = React.useState<string>("");

  // global state
  const searchUserInputs = useAppSelector((state) => state.search);
  const {
    fetchZipcode,
    fetchState,
    fetchStateCity,
    fetchRestaurant,
    fetchRestaurantState,
    fetchRestaurantStateCity,
    fetchRestaurantZipcode,
    zipcodeBackendInput,
    stateBackendInput,
    cityBackendInput,
    restaurantBackendInput,
  } = searchUserInputs;

  // React Router functions
  const location = ReactRouter.useLocation();
  const path = location.pathname;
  const navigate = ReactRouter.useNavigate();

  const queryParams = new URLSearchParams(location.search);
  console.log(
    queryParams,
    "url search params",
    queryParams.get("stateId"),
    queryParams.get("zipcode")
  );

  // ReduxToolkit functions
  const dispatch = useAppDispatch();
  const onSubmit = () => {
    console.log("clicked");
    const data = {
      userInput,
      backendCityData: cityData!,
      backendStateData: stateData!,
      backendZipData: zipData!,
      backendRestaurantData: restaurantData!,
    };
    // TODO: properly type validateUserInput with proper arguments to the function
    const queryStringValues = validateUserInput(data);
    const { state, city, zipcode, restaurantName } = queryStringValues;
    console.log(queryStringValues, "values");

    // sanity check: throw error if the user has not entered anything but still has clicked submit
    if (!zipcode?.id && !state?.id && !city?.id && !restaurantName?.id) {
      // TODO: error handling
      console.log("error: user didnt enter anything throw error");
    }

    // check which combination of inputs the user has entered to set query parameters and navigate
    switch (true) {
      case Boolean(restaurantName?.id) &&
        Boolean(zipcode?.id) &&
        Boolean(!state?.id) &&
        Boolean(!city?.id):
        console.log(" at restaurant zipcode no state");
        navigate(
          `/search-display?zipcodeId=${zipcode?.id}&zipcodeName=${zipcode?.name}&restaurantId=${restaurantName?.id}&restaurantName=${restaurantName?.name}`
        );
        break;
      //restaurantName, state
      case Boolean(restaurantName?.id) &&
        Boolean(state?.id) &&
        Boolean(!zipcode?.id) &&
        Boolean(!city?.id):
        console.log("restaurant, state, no zip");
        navigate(
          `/search-display?stateId=${state?.id}&stateName=${state?.name}&restaurantId=${restaurantName?.id}&restaurantName=${restaurantName?.name}`
        );
        break;
      //restaurantName, state, city
      case Boolean(restaurantName?.id) &&
        Boolean(state?.id) &&
        Boolean(city?.id) &&
        Boolean(!zipcode?.id):
        console.log("restaurant,state,city,nozip");
        navigate(
          `/search-display?stateId=${state?.id}&stateName=${state?.name}&cityId=${city?.id}&cityName=${city?.name}&restaurantId=${restaurantName?.id}&restaurantName=${restaurantName?.name}`
        );
        break;
      //restaurantName
      case Boolean(restaurantName?.id) &&
        Boolean(!state?.id) &&
        Boolean(!city?.id) &&
        Boolean(!zipcode?.id):
        console.log("only restaurant");
        navigate(
          `/search-display?stateId=restaurantId=${restaurantName?.id}&restaurantName=${restaurantName?.name}`
        );
        break;
      // zipcode
      case Boolean(zipcode?.id) &&
        Boolean(!state?.id) &&
        Boolean(!city?.id) &&
        Boolean(!restaurantName?.id):
        console.log(" only zipcode yes");
        navigate(
          `/search-display?zipcodeId=${zipcode?.id}&zipcodeName=${zipcode?.name}`
        );
        break;
      // state,city
      case Boolean(state?.id) &&
        Boolean(city?.id) &&
        Boolean(!zipcode?.id) &&
        Boolean(!restaurantName?.id):
        console.log("state and city no zipcode");
        navigate(
          `/search-display?cityId=${city?.id}&cityName=${city?.name}&stateId=${state?.id}&stateName=${state?.name}`
        );
        break;
      // state
      case Boolean(state?.id) &&
        Boolean(!city?.id) &&
        Boolean(!zipcode?.id) &&
        Boolean(!restaurantName?.id):
        console.log("only state no city no zipcode"); // no zipcode
        break;
      default:
        // TODO: error handling this means user didnt enter anything and submitted
        console.log(" error");
    }
  };

  // This function has to run regardless of any user input to populate auto-complete state, city, zipcode and restaurantName
  // cacheTime is set to infinite because autocomplete props are read only even for user so this data will not change in a user session.
  // Additionally SearchBar component is used in multiple routes, hence, it makes sense to cache data and not hit your backend api again and again.
  const geoLocationData = useQuery("getGeography", fetchAutoCompleteData, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (geoLocationData.isLoading) {
    console.log("loading");
    return <span>Loading...</span>;
  }

  if (geoLocationData.isError) {
    // TODO: in errors turn search query flags to false bakcned terms also need to update to {id:undefined, name:undefined}
    return <span>Error: error occured</span>;
  }
  // Set local state data if it does not exist
  const data = geoLocationData.data!;
  if (!autoCompleteData) {
    setAutoCompleteData(data.allValues);
  }
  if (!stateData) {
    setStateData(data.stateSet);
  }
  if (!cityData) {
    setCityData(data.citySet);
  }
  if (!zipData) {
    setZipData(data.zipSet);
  }
  if (!restaurantData) {
    setRestaurantData(data.restaurantSet);
  }

  const userInputOnChangeHandler = (value: string) => {
    setUserInput(value);
  };

  return (
    <React.Fragment>
      {path === "/" ? (
        <Group>
          <Autocomplete
            placeholder="Start typing to see options"
            value={userInput}
            limit={10}
            onChange={userInputOnChangeHandler}
            data={
              userInput.length ? (autoCompleteData ? autoCompleteData : []) : []
            }
          />
          <Button
            onClick={() => {
              console.log(" I was clicled");
              onSubmit();
            }}
          >
            Submit
          </Button>
        </Group>
      ) : (
        <React.Fragment>
          <Group>
            <Autocomplete
              placeholder="Start typing to see options"
              value={userInput}
              limit={10}
              onChange={userInputOnChangeHandler}
              data={
                userInput.length
                  ? autoCompleteData
                    ? autoCompleteData
                    : []
                  : []
              }
            />
            <Button
              onClick={() => {
                console.log(" I was clicled");
                onSubmit();
              }}
            >
              Submit
            </Button>
          </Group>
          <MapBoxMap />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
