import * as React from "react";
import { Autocomplete, Group, Button } from "@mantine/core";
import { useQuery } from "react-query";
import * as ReactRouter from "react-router-dom";

import { validateUserInput } from "../../BackendFunc-DataCalc/userInput";
import {
  fetchAutoCompleteData,
  ZipDocument,
  RestaurantDocument,
  CityDocument,
  StateDocument,
} from "../../BackendFunc-DataCalc/backendFunctions";
import { useAppDispatch, useAppSelector } from "../../redux-store/redux-hooks";
import {
  setMapGeolocationCardData,
  setHoverId,
  ActiveGeolocation,
  setIsOpenMapGeolocationCard,
  setIsOpenListGeolocationCard,
} from "../../redux-store/geolocation-slice";

export interface PropertiesProps {
  title: string;
  city: string;
  state_id: string;
  state: string;
  zip: string;
}

export const stringConstants = {
  stateId: "stateId",
  stateName: "stateName",
  cityId: "cityId",
  cityName: "cityName",
  zipcodeId: "zipcodeId",
  zipcodeName: "zipcodeName",
  restaurantId: "restaurantId",
  restaurantName: "restaurantName",
};

export const SearchBar: React.FC<{}> = () => {
  // React Router functions
  const location = ReactRouter.useLocation();
  const path = location.pathname;
  const navigate = ReactRouter.useNavigate();

  // query string values we need these to populate autocomplete value
  const queryParams = new URLSearchParams(location.search);
  const state = {
    id: queryParams.get(stringConstants.stateId),
    name: queryParams.get(stringConstants.stateName),
  };
  const city = {
    id: queryParams.get(stringConstants.cityId),
    name: queryParams.get(stringConstants.cityName),
  };
  const zipcode = {
    id: queryParams.get(stringConstants.zipcodeId),
    name: queryParams.get(stringConstants.zipcodeName),
  };
  const restaurant = {
    id: queryParams.get(stringConstants.restaurantId),
    name: queryParams.get(stringConstants.restaurantName),
  };
  // state functions
  const [userInput, setUserInput] = React.useState<string>(
    `${
      restaurant.name
        ? `${restaurant.name}${city.name ? `, ${city.name}` : ""}${
            state.name ? `, ${state.name}` : ""
          }${zipcode.name ? `, ${zipcode.name}` : ""}`
        : `${city.name ? city.name : ""}${state.name ? `, ${state.name}` : ""}${
            zipcode.name ? `, ${zipcode.name}` : ""
          }`
    }`
    //
  );
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
  const [isEdgeCase, setIsEdgeCase] = React.useState(false);

  // ReduxToolkit functions
  const dispatch = useAppDispatch();
  // This function has to run regardless of any user input to populate auto-complete state, city, zipcode and restaurantName
  // cacheTime is set to infinite because autocomplete props are read only even for user so this data will not change in a user session.
  // Additionally SearchBar component is used in multiple routes, hence, it makes sense to cache data and not hit your backend api again and again.
  const geoLocationData = useQuery("getGeography", fetchAutoCompleteData, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (geoLocationData.isLoading) {
    // TODO: loading component
    console.log("loading");
    return <span>Loading...</span>;
  }

  if (geoLocationData.isError) {
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

  const onSubmit = () => {
    dispatch(setIsOpenListGeolocationCard(false));
    setIsEdgeCase(false);

    const data = {
      userInput,
      backendCityData: cityData!,
      backendStateData: stateData!,
      backendZipData: zipData!,
      backendRestaurantData: restaurantData!,
    };
    try {
      const queryStringValues = validateUserInput(data);
      const { state, city, zipcode, restaurant } = queryStringValues;
      // sanity check: throw error if the user has not entered anything but still has clicked submit
      if (!zipcode?.id && !state?.id && !city?.id && !restaurant?.id) {
        setIsEdgeCase(true);
      }

      // check which combination of inputs the user has entered to set query parameters and navigate
      switch (true) {
        case Boolean(restaurant?.id) &&
          Boolean(zipcode?.id) &&
          Boolean(!state?.id) &&
          Boolean(!city?.id):
          console.log(" at restaurant zipcode no state");
          navigate(
            `/search-display?${stringConstants.zipcodeId}=${zipcode?.id}&${stringConstants.zipcodeName}=${zipcode?.name}&${stringConstants.restaurantId}=${restaurant?.id}&${stringConstants.restaurantName}=${restaurant?.name}`
          );
          break;
        //restaurantName, state
        case Boolean(restaurant?.id) &&
          Boolean(state?.id) &&
          Boolean(!zipcode?.id) &&
          Boolean(!city?.id):
          console.log("restaurant, state, no zip");
          navigate(
            `/search-display?${stringConstants.stateId}=${state?.id}&${stringConstants.stateName}=${state?.name}&${stringConstants.restaurantId}=${restaurant?.id}&${stringConstants.restaurantName}=${restaurant?.name}`
          );
          break;
        //restaurant, state, city
        case Boolean(restaurant?.id) &&
          Boolean(state?.id) &&
          Boolean(city?.id) &&
          Boolean(!zipcode?.id):
          console.log("restaurant,state,city,nozip");
          navigate(
            `/search-display?${stringConstants.stateId}=${state?.id}&${stringConstants.stateName}=${state?.name}&${stringConstants.cityId}=${city?.id}&${stringConstants.cityName}=${city?.name}&${stringConstants.restaurantId}=${restaurant?.id}&${stringConstants.restaurantName}=${restaurant?.name}`
          );
          break;
        //restaurantName
        case Boolean(restaurant?.id) &&
          Boolean(!state?.id) &&
          Boolean(!city?.id) &&
          Boolean(!zipcode?.id):
          console.log("only restaurant");
          navigate(
            `/search-display?${stringConstants.stateId}=${stringConstants.restaurantId}=${restaurant?.id}&${stringConstants.restaurantName}=${restaurant?.name}`
          );
          break;
        // zipcode
        case Boolean(zipcode?.id) &&
          Boolean(state?.id) &&
          Boolean(city?.id) &&
          Boolean(!restaurant?.id):
          console.log(" only zipcode yes");
          navigate(
            `/search-display?${stringConstants.cityId}=${city?.id}&${stringConstants.cityName}=${city?.name}&${stringConstants.stateId}=${state?.id}&${stringConstants.stateName}=${state?.name}&${stringConstants.zipcodeId}=${zipcode?.id}&${stringConstants.zipcodeName}=${zipcode?.name}`
          );
          break;
        // state,city
        case Boolean(state?.id) &&
          Boolean(city?.id) &&
          Boolean(!zipcode?.id) &&
          Boolean(!restaurant?.id):
          console.log("state and city no zipcode");
          navigate(
            `/search-display?${stringConstants.cityId}=${city?.id}&${stringConstants.cityName}=${city?.name}&${stringConstants.stateId}=${state?.id}&${stringConstants.stateName}=${state?.name}`
          );
          break;
        // state
        case Boolean(state?.id) &&
          Boolean(!city?.id) &&
          Boolean(!zipcode?.id) &&
          Boolean(!restaurant?.id):
          console.log("only state no city no zipcode"); // no zipcode
          navigate(
            `/search-display?${stringConstants.stateId}=${state?.id}&${stringConstants.stateName}=${state?.name}`
          );
          break;
        default:
          // Edge Cases
          // TODO: Error handling
          // This is the case where user entered wrong combination of inputs like only city no state etc or restaurant and city but no state
          setIsEdgeCase(true);
          throw new Error("user entered wrong combination of input");
      }
    } catch (err) {
      // Edge Cases
      // TODO: the user didnt enter anything and our functions assume that userInput string has a length and they throw error
      console.log(err);
      setIsEdgeCase(true);
    }
  };

  return (
    <React.Fragment>
      {path === "/" ? (
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
                onSubmit();
              }}
            >
              Submit
            </Button>
          </Group>
          {isEdgeCase ? <div>Oops we didnt find anything</div> : ""}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {isEdgeCase ? (
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
                    onSubmit();
                  }}
                >
                  Submit
                </Button>
              </Group>
              {/*TODO: Error handling*/}
              <div>Oops we didnt find anything</div>
            </React.Fragment>
          ) : (
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
                  onSubmit();
                }}
              >
                Submit
              </Button>
            </Group>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
