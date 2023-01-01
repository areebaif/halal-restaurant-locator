import * as React from "react";
import { AutocompleteItem } from "@mantine/core";
import { useQuery } from "react-query";
import * as ReactRouter from "react-router-dom";
import AutoCompleteInput from "./autocomplete";
import { MapBoxMap } from "./map";

import {
  fetchZipSearch,
  fetchAutoCompleteData,
  ZipDocument,
  restaurantDocument,
  cityDocument,
  stateDocument,
  FetchAutomplete,
  fetchStateSearch,
  fetchStateAndCitySearch,
} from "../BackendFunc-DataCalc/backendFunctions";
import { useAppDispatch, useAppSelector } from "../redux-store/redux-hooks";
import {
  onZipcodeUserInputChange,
  onStateUserInputChange,
  onCityUserInputChange,
  onRestaurantNameUserInputChange,
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

export interface PropertiesProps {
  title: string;
  city: string;
  state_id: string;
  state: string;
  zip: string;
}

export const SearchBar: React.FC<{}> = () => {
  // we are using mantine autocomplete component to populate data. This component has typing defined as AutoCompleteItem
  // data to populate autocomplete component
  const [stateData, setStateData] = React.useState<AutocompleteItem[]>();
  const [cityData, setCityData] = React.useState<AutocompleteItem[]>();
  const [zipData, setZipData] = React.useState<AutocompleteItem[]>();
  const [restaurantData, setRestaurantData] =
    React.useState<AutocompleteItem[]>();

  // global state
  const searchUserInputs = useAppSelector((state) => state.search);
  const {
    zipcodeUserInput,
    stateUserInput,
    cityUserInput,
    restaurantNameUserInput,
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

  // error props
  const [errorZipcodeUserInput, setErrorZipcodeUserInput] =
    React.useState(false);
  const [errorCityUserInput, setErrorCityUserInput] = React.useState(false);
  const [errorStateUserInput, setErrorStateUserInput] = React.useState(false);

  // React Router functions
  const location = ReactRouter.useLocation();
  const path = location.pathname;
  const navigate = ReactRouter.useNavigate();

  // ReduxToolkit functions
  const dispatch = useAppDispatch();

  // onChange functions
  const onRestaurantNameUserChange = (value: string) => {
    dispatch(onRestaurantNameUserInputChange(value));
  };

  const onStateUserChange = (value: string) => {
    // Check for special characters including numbers
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);

    if (!specialCharsTest) {
      setErrorStateUserInput(false);
      dispatch(onStateUserInputChange(value));
    } else {
      setErrorStateUserInput(true);
      dispatch(onStateUserInputChange(value));
    }
  };

  const onCityUserChange = (value: string) => {
    // Check for special characters including numbers (dont check for white spaces some cities are two words with whote space in between)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);
    if (!specialCharsTest) {
      setErrorCityUserInput(false);
      dispatch(onCityUserInputChange(value));
    } else {
      setErrorCityUserInput(true);
      dispatch(onCityUserInputChange(value));
    }
  };

  const onZipcodeUserChange = (value: string) => {
    // check for white spaces in zipcode
    const specialChars = /[ ]/;
    const expression = true;
    switch (expression) {
      case specialChars.test(value):
        setErrorZipcodeUserInput(true);
        dispatch(onZipcodeUserInputChange(value));
        break;
      case isNaN(Number(value)):
        setErrorZipcodeUserInput(true);
        dispatch(onZipcodeUserInputChange(value));
        break;
      default:
        setErrorZipcodeUserInput(false);
        dispatch(onZipcodeUserInputChange(value));
    }
  };

  const validateUserInputUpdateBackendInput = () => {
    let trimmedZipCode = zipcodeUserInput?.trim();
    let trimmedCity = cityUserInput?.trim();
    let trimmedState = stateUserInput?.trim();
    let trimmedRestaurantNameUserInput = restaurantNameUserInput?.trim();

    // validCity
    if (trimmedCity.length) {
      const cityArray = trimmedCity?.split(" ");
      const cityUpperCase = cityArray?.map(
        (item) => item[0].toUpperCase() + item.substring(1)
      );
      trimmedCity = cityUpperCase?.join(" ");
      const validCity = cityData?.filter((item) => item.name === trimmedCity);
      if (!validCity?.length) {
        //TODO: error handling
        //throw new Error("lolz");
        console.log("error: you have entered an incorrect city value");
      }
      // update state
      const backendTermAutoCompleteItem = validCity?.[0];
      const backendTerm: { id: number; name: string } = {
        id: backendTermAutoCompleteItem?.id,
        name: backendTermAutoCompleteItem?.name,
      };
      onCityUserInputChange(trimmedCity);
      dispatch(onCityBackendInputChange(backendTerm));
    }
    // validState
    if (trimmedState.length) {
      const stateArray = trimmedState?.split(" ");
      const stateUpperCase = stateArray?.map(
        (item) => item[0].toUpperCase() + item.substring(1)
      );
      trimmedState = stateUpperCase?.join(" ");
      const validState = stateData?.filter(
        (item) => item.name === trimmedState
      );

      if (!validState?.length) {
        //TODO: error handling
        console.log("error: you have entered an incorrect state value");
      }
      // update state
      const backendTermAutoCompleteItem = validState?.[0];
      const backendTerm: { id: number; name: string } = {
        id: backendTermAutoCompleteItem?.id,
        name: backendTermAutoCompleteItem?.name,
      };
      onStateUserInputChange(trimmedState);
      dispatch(onStateBackendInputChange(backendTerm));
    }
    // valid restaurantName
    if (trimmedRestaurantNameUserInput.length) {
      const restaurantNameArray = trimmedRestaurantNameUserInput?.split(" ");
      const restaurantNameUpperCase = restaurantNameArray?.map(
        (item) => item[0].toUpperCase() + item.substring(1)
      );
      trimmedRestaurantNameUserInput = restaurantNameUpperCase?.join(" ");

      const validRestaurantName = restaurantData?.filter(
        (item) => item.name === trimmedRestaurantNameUserInput
      );

      if (!validRestaurantName?.length) {
        //TODO: error handling
        console.log("error: you have entered an incorrect state value");
      }
      // update state
      const backendTermAutoCompleteItem = validRestaurantName?.[0];
      const backendTerm: { id: number; name: string } = {
        id: backendTermAutoCompleteItem?.id,
        name: backendTermAutoCompleteItem?.name,
      };
      onRestaurantNameUserInputChange(trimmedRestaurantNameUserInput);
      dispatch(onRestaurantdeBackendInputChange(backendTerm));
    }
    // valid zipCode
    if (trimmedZipCode.length) {
      //TODO: check valid zipcode
      const validZip = zipData?.filter((item) => {
        return item.value === trimmedZipCode;
      });
      if (!validZip?.length) {
        //TODO: error handling
        console.log("no valid zip");
      }
      // update state
      const backendTermAutoCompleteItem = validZip?.[0];
      const backendTerm: { id: number; name: string } = {
        id: backendTermAutoCompleteItem?.id,
        name: backendTermAutoCompleteItem?.name,
      };
      onZipcodeUserInputChange(trimmedZipCode);
      dispatch(onZipCodeBackendInputChange(backendTerm));
    }
  };

  const onSubmit = () => {
    // before triggering a backend api call check if the user has entered a valid state, city, zipcode or restaurantName values
    // since we are already validating user input by comparing it to the values recieved from backend, so in this function we are also updating global state for data to be sent to backend
    // Yes this is not a pure function and does twpo things
    // TODO: might separate the above two functionalities out in the future.
    validateUserInputUpdateBackendInput();

    // sanity check: throw error if the user hasnt entered anything but still has clicked submit
    if (
      !zipcodeUserInput.length &&
      !stateUserInput.length &&
      !cityUserInput.length &&
      !restaurantNameUserInput.length
    ) {
      // TODO: error handling
      console.log("error: user didnt enter anything throw error");
    }

    // check which combination of inputs the user has entered to trigger backend calls to get data.
    if (path === "/") {
      switch (true) {
        case Boolean(restaurantNameUserInput) &&
          Boolean(zipcodeUserInput) &&
          Boolean(!stateUserInput) &&
          Boolean(!cityUserInput):
          console.log(" at restaurant zipcode no state");
          dispatch(onFetchRestaurantZipcode(true));
          break;
        //restaurantName, state
        case Boolean(restaurantNameUserInput) &&
          Boolean(stateUserInput) &&
          Boolean(!zipcodeUserInput) &&
          Boolean(!cityUserInput):
          console.log("restaurant, state, no zip");
          dispatch(onFetchRestaurantState(true));
          break;
        //restaurantName, state, city
        case Boolean(restaurantNameUserInput) &&
          Boolean(stateUserInput) &&
          Boolean(cityUserInput) &&
          Boolean(!zipcodeUserInput):
          console.log("restaurant,state,city,nozip");
          dispatch(onFetchRestaurantStateCity(true));
          break;
        //restaurantName
        case Boolean(restaurantNameUserInput) &&
          Boolean(!stateUserInput) &&
          Boolean(!cityUserInput) &&
          Boolean(!zipcodeUserInput):
          console.log("only restaurant");
          dispatch(onFetchRestaurant(true));
          break;
        // zipcode
        case Boolean(zipcodeUserInput) &&
          Boolean(!stateUserInput) &&
          Boolean(!cityUserInput) &&
          Boolean(!restaurantNameUserInput):
          console.log(" only zipcode yes");
          dispatch(onFetchZipcode(true));
          //setZipcodeUserInput(zipcodeUserInput!);
          break;
        // state,city
        case Boolean(stateUserInput) &&
          Boolean(cityUserInput) &&
          Boolean(!zipcodeUserInput) &&
          Boolean(!restaurantNameUserInput):
          console.log("state and city no zipcode");
          dispatch(onFetchStateCity(true));
          break;
        // state
        case Boolean(stateUserInput) &&
          Boolean(!cityUserInput) &&
          Boolean(!zipcodeUserInput) &&
          Boolean(!restaurantNameUserInput):
          console.log("only state no city no zipcode"); // no zipcode
          dispatch(onFetchState(true));
          break;
        default:
          // TODO: error handling this means user didnt enter anything and submitted
          console.log("error");
      }
      navigate("/search-display");
    } else {
      // TODO: setRefreshMapData to true after getting a response from backend not in the backend function after that
      switch (true) {
        case Boolean(restaurantNameUserInput) &&
          Boolean(zipcodeUserInput) &&
          Boolean(!stateUserInput) &&
          Boolean(!cityUserInput):
          console.log(" at restaurant zipcode no state");
          dispatch(onFetchRestaurantZipcode(true));

          break;
        //restaurantName, state
        case Boolean(restaurantNameUserInput) &&
          Boolean(stateUserInput) &&
          Boolean(!zipcodeUserInput) &&
          Boolean(!cityUserInput):
          console.log("restaurant, state, no zip");
          dispatch(onFetchRestaurantState(true));
          break;
        //restaurantName, state, city
        case Boolean(restaurantNameUserInput) &&
          Boolean(stateUserInput) &&
          Boolean(cityUserInput) &&
          Boolean(!zipcodeUserInput):
          console.log("restaurant,state,city,nozip");
          dispatch(onFetchRestaurantStateCity(true));
          break;
        //restaurantName
        case Boolean(restaurantNameUserInput) &&
          Boolean(!stateUserInput) &&
          Boolean(!cityUserInput) &&
          Boolean(!zipcodeUserInput):
          console.log("only restaurant");
          dispatch(onFetchRestaurant(true));
          break;
        // zipcode
        case Boolean(zipcodeUserInput) &&
          Boolean(!stateUserInput) &&
          Boolean(!cityUserInput) &&
          Boolean(!restaurantNameUserInput):
          console.log(" only zipcode yes");
          dispatch(onFetchZipcode(true));
          //setZipcodeUserInput(zipcodeUserInput!);
          break;
        // state,city
        case Boolean(stateUserInput) &&
          Boolean(cityUserInput) &&
          Boolean(!zipcodeUserInput) &&
          Boolean(!restaurantNameUserInput):
          console.log("state and city no zipcode");
          dispatch(onFetchStateCity(true));
          break;
        // state
        case Boolean(stateUserInput) &&
          Boolean(!cityUserInput) &&
          Boolean(!zipcodeUserInput) &&
          Boolean(!restaurantNameUserInput):
          console.log("only state no city no zipcode"); // no zipcode
          dispatch(onFetchState(true));
          break;
        // TODO: error handling this means user didnt enter anything and submitted
        default:
          console.log("error");
      }
      //dispatch(onRefreshMapDataChange(true));
    }
  };

  // This function has to run regardless of any user input to populate auto-complete inputs of state, city, zipcode and restaurantName
  // cacheTime is set to infinite because autocomplete props are read only even for user so this data will not change in a user session.
  // Additionally SearchBar component is used in multiple routes, hence, it makes sense to cache data and not hit your backend api again and again.
  const geoLocationData = useQuery("getGeography", fetchAutoCompleteData, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const stateSearchResult = useQuery(
    ["fetchStateSearch", stateBackendInput.id],
    () => fetchStateSearch(stateBackendInput.id!),
    {
      enabled: false || fetchState,
      onSuccess: (data) => {
        // TODO: set Map data
        dispatch(onFetchState(false));
        dispatch(onStateBackendInputChange({ id: undefined, name: undefined }));
      },
    }
  );

  const StateCitySearchResult = useQuery(
    ["fetchStateCity", stateBackendInput.id, cityBackendInput.id],
    () => fetchStateAndCitySearch(stateBackendInput.id!, cityBackendInput.id!),
    {
      enabled: false || fetchStateCity,
      onSuccess: (data) => {
        // TODO: setMap Data
        dispatch(onFetchStateCity(false));
        dispatch(onStateBackendInputChange({ id: undefined, name: undefined }));
        dispatch(onCityBackendInputChange({ id: undefined, name: undefined }));
      },
    }
  );

  if (geoLocationData.isLoading) {
    console.log("loading");
    return <span>Loading...</span>;
  }

  if (geoLocationData.isError) {
    // TODO: in errors turn search query flags to false bakcned terms also need to update to {id:undefined, name:undefined}
    return <span>Error: error occured</span>;
  }
  // Set SearchBar auto complete data
  const data = geoLocationData.data!;
  if (!stateData) {
    const stateFormattedData = data.stateSet.map((item) => {
      return { ...item, value: item.name };
    });
    setStateData(stateFormattedData);
  }
  if (!cityData) {
    const cityFormattedData = data.citySet.map((item) => {
      return { ...item, value: item.name };
    });
    setCityData(cityFormattedData);
  }
  if (!zipData) {
    const zipFormattedData = data.zipSet.map((item: ZipDocument) => ({
      ...item,
      value: item.properties.zip,
    }));
    setZipData(zipFormattedData);
  }
  if (!restaurantData) {
    const restaurantFormattedData = data.restaurantSet.map((item) => ({
      ...item,
      value: item.name,
    }));
    setRestaurantData(restaurantFormattedData);
  }

  return (
    <React.Fragment>
      {path === "/" ? (
        <AutoCompleteInput
          onSubmit={onSubmit}
          zipcode={{
            zipData: zipcodeUserInput.length > 0 ? zipData : [],
            errorZipcodeUserInput: errorZipcodeUserInput,
            onZipcodeUserInputChange: onZipcodeUserChange,
            zipcodeUserInput: zipcodeUserInput,
          }}
          state={{
            stateData: stateUserInput.length > 0 ? stateData : [],
            onStateUserInputChange: onStateUserChange,
            errorStateUserInput: errorStateUserInput,
            stateUserInput: stateUserInput,
          }}
          city={{
            cityData: cityUserInput.length > 0 ? cityData : [],
            onCityUserInputChange: onCityUserChange,
            errorCityUserInput: errorCityUserInput,
            cityUserInput: cityUserInput,
          }}
          restaurant={{
            restaurantNameUserInput: restaurantNameUserInput,
            onRestaurantNameUserInputChange: onRestaurantNameUserChange,
            restaurantData:
              restaurantNameUserInput.length > 0 ? restaurantData : [],
          }}
        />
      ) : (
        <React.Fragment>
          <AutoCompleteInput
            onSubmit={onSubmit}
            zipcode={{
              zipData: zipcodeUserInput.length > 0 ? zipData : [],
              errorZipcodeUserInput: errorZipcodeUserInput,
              onZipcodeUserInputChange: onZipcodeUserChange,
              zipcodeUserInput: zipcodeUserInput,
            }}
            state={{
              stateData: stateUserInput.length > 0 ? stateData : [],
              onStateUserInputChange: onStateUserChange,
              errorStateUserInput: errorStateUserInput,
              stateUserInput: stateUserInput,
            }}
            city={{
              cityData: cityUserInput.length > 0 ? cityData : [],
              onCityUserInputChange: onCityUserChange,
              errorCityUserInput: errorCityUserInput,
              cityUserInput: cityUserInput,
            }}
            restaurant={{
              restaurantNameUserInput: restaurantNameUserInput,
              onRestaurantNameUserInputChange: onRestaurantNameUserChange,
              restaurantData:
                restaurantNameUserInput.length > 0 ? restaurantData : [],
            }}
          />
          <MapBoxMap />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
