import * as React from "react";
import { Autocomplete, Button, Group, AutocompleteItem } from "@mantine/core";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import * as ReactRouter from "react-router-dom";
import { fetchZipSearch } from "../backendFunctions";
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

export interface restaurantDocument {
  id: BigInteger;
  name: string;
  state: string;
  city: string;
  country: string;
  zipcode: string;
  longitude: number;
  latitude: number;
  // geolocation: [longitude,latitude]
  geolocation: [number, number];
}

export interface PropertiesProps {
  title: string;
  city: string;
  state_id: string;
  state: string;
  zip: string;
}

export interface cityDocument {
  id: number;
  name: string;
}

export interface stateDocument {
  id: number;
  name: string;
}
export interface ZipDocument {
  city_state: string;
  type: "Feature";
  properties: {
    title: string;
    city: string;
    state_id: string;
    state: string;
    zip: string;
  };
  id: number;
  geometry: {
    coordinates: [number, number];
    type: "Point";
  };
}

interface AutoCompleteInputProps {
  zipcode: {
    zipData: AutocompleteItem[] | undefined;
    errorZipcodeUserInput: boolean;
    onZipcodeUserInputChange: (value: string) => void;
    zipcodeUserInput: string;
  };
  state: {
    stateData: AutocompleteItem[] | undefined;
    errorStateUserInput: boolean;
    onStateUserInputChange: (value: string) => void;
    stateUserInput: string;
  };
  city: {
    cityData: AutocompleteItem[] | undefined;
    errorCityUserInput: boolean;
    onCityUserInputChange: (value: string) => void;
    cityUserInput: string;
  };
  restaurant: {
    restaurantData: AutocompleteItem[] | undefined;
    onRestaurantNameUserInputChange: (value: string) => void;
    restaurantNameUserInput: string;
  };
  onSubmit: () => void;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  zipcode,
  state,
  city,
  restaurant,
  onSubmit,
}) => {
  const {
    zipData,
    errorZipcodeUserInput,
    onZipcodeUserInputChange,
    zipcodeUserInput,
  } = zipcode;
  const {
    stateData,
    errorStateUserInput,
    onStateUserInputChange,
    stateUserInput,
  } = state;
  const { cityData, errorCityUserInput, onCityUserInputChange, cityUserInput } =
    city;

  const {
    restaurantData,
    onRestaurantNameUserInputChange,
    restaurantNameUserInput,
  } = restaurant;

  return (
    <React.Fragment>
      <Autocomplete
        label="name"
        placeholder="Start typing to see options"
        value={restaurantNameUserInput}
        limit={7}
        onChange={onRestaurantNameUserInputChange}
        data={restaurantData ? restaurantData : []}
      />
      <Group position="center" spacing="xl" grow={true}>
        {errorZipcodeUserInput ? (
          <Autocomplete
            label="Zip code"
            error="Please provide valid zipcode"
            onChange={onZipcodeUserInputChange}
            data={[]}
            value={zipcodeUserInput}
          />
        ) : (
          <Autocomplete
            label="zipcode"
            placeholder={`${
              cityUserInput.length || stateUserInput.length
                ? "state & city must be empty to search"
                : "Start typing to see options"
            } `}
            value={zipcodeUserInput}
            limit={7}
            disabled={Boolean(cityUserInput.length || stateUserInput.length)}
            onChange={onZipcodeUserInputChange}
            data={zipData ? zipData : []}
          />
        )}
        {errorCityUserInput ? (
          <Autocomplete
            label="city"
            error="Please provide valid city"
            placeholder="start typing"
            value={cityUserInput}
            onChange={onCityUserInputChange}
            data={[]}
          />
        ) : (
          <Autocomplete
            label="city"
            placeholder={`${
              zipcodeUserInput.length
                ? "zipcode must be empty to search"
                : "Start typing to see options"
            } `}
            value={cityUserInput}
            limit={7}
            disabled={Boolean(zipcodeUserInput.length)}
            onChange={onCityUserInputChange}
            data={cityData ? cityData : []}
          />
        )}
        {errorStateUserInput ||
        (cityUserInput.length > 0 && stateUserInput.length === 0) ? (
          <Autocomplete
            label="state"
            error={`${
              cityUserInput.length > 0 && stateUserInput.length === 0
                ? "state required if you are searching by city"
                : "Please provide valid state value"
            }`}
            placeholder={`${
              cityUserInput.length > 0 && stateUserInput.length === 0
                ? ""
                : "start typing"
            }`}
            value={stateUserInput}
            onChange={onStateUserInputChange}
            data={[]}
          />
        ) : (
          <Autocomplete
            label="state"
            placeholder={`${
              zipcodeUserInput.length
                ? "zipcode must be empty to search"
                : "Start typing to see options"
            } `}
            value={stateUserInput}
            limit={7}
            disabled={Boolean(zipcodeUserInput.length)}
            onChange={onStateUserInputChange}
            data={stateData ? stateData : []}
            required={cityUserInput.length > 0}
          />
        )}
        <Button
          disabled={
            errorCityUserInput ||
            errorZipcodeUserInput ||
            errorStateUserInput ||
            (cityUserInput.length > 0 && stateUserInput.length === 0)
          }
          onClick={() => {
            onSubmit();
            console.log("clicked");
          }}
        >
          Submit
        </Button>
      </Group>
    </React.Fragment>
  );
};

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
    zipcodeBackendInput,
    stateBackendInput,
    cityBackendInput,
    restaurantBackendInput,
    fetchZipcode,
  } = searchUserInputs;
  //const hasNavigated = useAppSelector((state) => state.search.hasNavigated);

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
      const backendTerm: { id: BigInteger; name: string } = {
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
      const backendTerm: { id: BigInteger; name: string } = {
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
      const backendTerm: { id: BigInteger; name: string } = {
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
      const backendTerm: { id: BigInteger; name: string } = {
        id: backendTermAutoCompleteItem?.id,
        name: backendTermAutoCompleteItem?.name,
      };
      onZipcodeUserInputChange(trimmedZipCode);
      dispatch(onZipCodeBackendInputChange(backendTerm));
    }
  };
  console.log(fetchZipcode, "flag");
  const zipCodeSearchResult = useQuery(
    ["getZipCodeSearch", zipcodeUserInput],
    () => fetchZipSearch(zipcodeUserInput),
    {
      enabled: false || fetchZipcode,
      onSuccess: (data) => {
        console.log("success case");
        console.log(data);

        //dispatch(onNavigation(false));
        console.log("dispatched");
        dispatch(onFetchZipcode(false));
        // const mapLocations: GeoJSON.FeatureCollection<
        //   GeoJSON.Geometry,
        //   PropertiesProps
        // > = {
        //   type: "FeatureCollection",
        //   features: data.length ? data : [],
        // };
        //setMapData(mapLocations);
        //setRefreshMapData(true);
        // setZipcodeUserInput("");
      },
    }
  );

  //console.log(zipcodeBackendInput);

  const onSubmit = () => {
    // before triggering a backend api call check if the user has entered a valid state, city, zipcode or restaurantName values
    // since we are already checking with backend input terms, we are also updating the values to be sent to backend to fetch data
    validateUserInputUpdateBackendInput();
    // update backednSearch terms
    if (
      !zipcodeUserInput.length &&
      !stateUserInput.length &&
      !cityUserInput.length &&
      !restaurantNameUserInput.length
    ) {
      // TODO: error handling
      console.log("error: user didnt enter anything throw error");
    }

    // check which combination of inputs the user has entered to update reactQueryflags for those functions to trigger backend api call
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
        // TODO: error handling this means user didnt enter anything and submitted
        default:
          console.log("error");
      }

      // redirect
      // TODO: we need to check which values the user has entered and manually trigger hasNavigated store it in reduz so that reactQuery can work with it.
      //dispatch(onNavigation(true));
      navigate("/search-display");
    } else {
      console.log("I am in else case");
      //TODO: depending on user input trigger backend call
      // restaurantName, zipcode
      // switch (true) {
      //     case
      // }

      //   if (
      //     zipcodeUserInput.length &&
      //     !stateUserInput.length &&
      //     !cityUserInput.length &&
      //     !restaurantNameUserInput.length
      //   ) {
      //     console.log("hitting the right case");
      //     zipCodeSearchResult.refetch();
      //     // call the zipcode api and setMapData and makezipcodeUserInput null
      //   }
    }
  };

  // This function has to run regardless of any user input to populate auto-complete inputs of state, city, zipcode and restaurantName
  // TODO: This function should run only once and keep the results cached and not run again
  const URL = "/api/dev/getGeography";
  const geoLocationData = useQuery(
    "getGeography",
    async () => {
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: {
        data: {
          citySet: cityDocument[];
          stateSet: stateDocument[];
          zipSet: ZipDocument[];
          restaurantSet: restaurantDocument[];
        };
      } = await response.json();
      return data.data;
    },
    {
      onSuccess: (data) => {
        const stateFormattedData = data.stateSet.map((item) => {
          return { ...item, value: item.name };
        });
        const cityFormattedData = data.citySet.map((item) => {
          return { ...item, value: item.name };
        });
        const zipFormattedData = data.zipSet.map((item: ZipDocument) => ({
          ...item,
          value: item.properties.zip,
        }));
        // might throw error since we are not sending any data
        const restaurantFormattedData = data.restaurantSet.map(
          (item: restaurantDocument) => ({
            ...item,
            value: item.name,
          })
        );
        setStateData(stateFormattedData);
        setCityData(cityFormattedData);
        setRestaurantData(restaurantFormattedData);
        setZipData(zipFormattedData);
      },
    }
  );

  if (geoLocationData.isLoading) {
    return <span>Loading...</span>;
  }

  if (geoLocationData.isError) {
    //dispatch(onNavigation(false));
    return <span>Error: error occured</span>;
  }

  return (
    <React.Fragment>
      {path === "/" ? (
        <AutoCompleteInput
          onSubmit={onSubmit}
          zipcode={{
            zipData: zipData,
            errorZipcodeUserInput: errorZipcodeUserInput,
            onZipcodeUserInputChange: onZipcodeUserChange,
            zipcodeUserInput: zipcodeUserInput,
          }}
          state={{
            stateData: stateData,
            onStateUserInputChange: onStateUserChange,
            errorStateUserInput: errorStateUserInput,
            stateUserInput: stateUserInput,
          }}
          city={{
            cityData: cityData,
            onCityUserInputChange: onCityUserChange,
            errorCityUserInput: errorCityUserInput,
            cityUserInput: cityUserInput,
          }}
          restaurant={{
            restaurantNameUserInput: restaurantNameUserInput,
            onRestaurantNameUserInputChange: onRestaurantNameUserChange,
            restaurantData: restaurantData,
          }}
        />
      ) : (
        <div>
          <AutoCompleteInput
            onSubmit={onSubmit}
            zipcode={{
              zipData: zipData,
              errorZipcodeUserInput: errorZipcodeUserInput,
              onZipcodeUserInputChange: onZipcodeUserChange,
              zipcodeUserInput: zipcodeUserInput,
            }}
            state={{
              stateData: stateData,
              onStateUserInputChange: onStateUserChange,
              errorStateUserInput: errorStateUserInput,
              stateUserInput: stateUserInput,
            }}
            city={{
              cityData: cityData,
              onCityUserInputChange: onCityUserChange,
              errorCityUserInput: errorCityUserInput,
              cityUserInput: cityUserInput,
            }}
            restaurant={{
              restaurantNameUserInput: restaurantNameUserInput,
              onRestaurantNameUserInputChange: onRestaurantNameUserChange,
              restaurantData: restaurantData,
            }}
          />
          <div>` yolo ${zipcodeUserInput}`</div>
        </div>
      )}
    </React.Fragment>
  );
};
