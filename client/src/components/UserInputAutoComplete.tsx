import * as React from "react";
import { Autocomplete, Button, Group, AutocompleteItem } from "@mantine/core";
import { useQuery } from "react-query";
import * as ReactRouter from "react-router-dom";
import { fetchZipSearch } from "../backendFunctions";
import { useAppDispatch, useAppSelector } from "../redux-store/redux-hooks";
import {
  onZipcodeChange,
  onStateChange,
  onCityChange,
  onRestaurantNameChange,
  onNavigation,
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
  const { zipcodeInput, stateInput, cityInput, restaurantNameInput } =
    searchUserInputs;
  const hasNavigated = useAppSelector((state) => state.search.hasNavigated);

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
  const onRestaurantNameUserInputChange = (value: string) => {
    dispatch(onRestaurantNameChange(value));
  };

  const onStateUserInputChange = (value: string) => {
    // Check for special characters including numbers
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);

    if (!specialCharsTest) {
      setErrorStateUserInput(false);
      dispatch(onStateChange(value));
    } else {
      setErrorStateUserInput(true);
      dispatch(onStateChange(value));
    }
  };

  const onCityUserInputChange = (value: string) => {
    // Check for special characters including numbers (dont check for white spaces some cities are two words with whote space in between)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};',:"\\|.<>\/?~0123456789]/;
    const specialCharsTest = specialChars.test(value);
    if (!specialCharsTest) {
      setErrorCityUserInput(false);
      dispatch(onCityChange(value));
    } else {
      setErrorCityUserInput(true);
      dispatch(onCityChange(value));
    }
  };

  const onZipcodeUserInputChange = (value: string) => {
    // check for white spaces in zipcode
    const specialChars = /[ ]/;
    const expression = true;
    switch (expression) {
      case specialChars.test(value):
        setErrorZipcodeUserInput(true);
        dispatch(onZipcodeChange(value));
        break;
      case isNaN(Number(value)):
        setErrorZipcodeUserInput(true);
        dispatch(onZipcodeChange(value));
        break;
      default:
        setErrorZipcodeUserInput(false);
        dispatch(onZipcodeChange(value));
    }
  };

  const validUserInput = () => {
    let trimmedZipCode = zipcodeInput?.trim();
    let trimmedCity = cityInput?.trim();
    let trimmedState = stateInput?.trim();
    let trimmedRestaurantNameUserInput = restaurantNameInput?.trim();

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
        console.log("error: you have entered an incorrect city value");
      }
      onCityUserInputChange(trimmedCity);
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
      onStateUserInputChange(trimmedState);
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
      onRestaurantNameUserInputChange(trimmedRestaurantNameUserInput);
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
      onZipcodeUserInputChange(trimmedZipCode);
    }
  };

  const zipCodeSearchResult = useQuery(
    ["getZipCodeSearch", zipcodeInput],
    () => fetchZipSearch(zipcodeInput),
    {
      enabled: false || hasNavigated,
      onSuccess: (data) => {
        console.log("success case");

        dispatch(onNavigation(false));
        console.log("dispatched");
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

  const onSubmit = () => {
    // before triggering a backend api call check if the user has entered a valid state, city, zipcode or restaurantName values
    validUserInput();
    if (
      !zipcodeInput.length &&
      !stateInput.length &&
      !cityInput.length &&
      !restaurantNameInput.length
    ) {
      // TODO: error handling
      console.log("error: user didnt enter anything throw error");
    }

    // TODO:
    // check which combination of inputs the user has entered to update reactQueryflags for those functions to trigger backend api call
    if (path === "/") {
      // redirect
      // TODO: we need to check which values the user has entered and manually trigger hasNavigated store it in reduz so that reactQuery can work with it.
      dispatch(onNavigation(true));
      navigate("/search-display");
    } else {
      console.log("I am in else case");
      //TODO: depending on user input trigger backend call
      // restaurantName, zipcode
      // switch (true) {
      //     case
      // }

      if (
        zipcodeInput.length &&
        !stateInput.length &&
        !cityInput.length &&
        !restaurantNameInput.length
      ) {
        console.log("hitting the right case");
        zipCodeSearchResult.refetch();
        // call the zipcode api and setMapData and makezipcodeUserInput null
      }
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
    dispatch(onNavigation(false));
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
            onZipcodeUserInputChange: onZipcodeUserInputChange,
            zipcodeUserInput: zipcodeInput,
          }}
          state={{
            stateData: stateData,
            onStateUserInputChange: onStateUserInputChange,
            errorStateUserInput: errorStateUserInput,
            stateUserInput: stateInput,
          }}
          city={{
            cityData: cityData,
            onCityUserInputChange: onCityUserInputChange,
            errorCityUserInput: errorCityUserInput,
            cityUserInput: cityInput,
          }}
          restaurant={{
            restaurantNameUserInput: restaurantNameInput,
            onRestaurantNameUserInputChange: onRestaurantNameUserInputChange,
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
              onZipcodeUserInputChange: onZipcodeUserInputChange,
              zipcodeUserInput: zipcodeInput,
            }}
            state={{
              stateData: stateData,
              onStateUserInputChange: onStateUserInputChange,
              errorStateUserInput: errorStateUserInput,
              stateUserInput: stateInput,
            }}
            city={{
              cityData: cityData,
              onCityUserInputChange: onCityUserInputChange,
              errorCityUserInput: errorCityUserInput,
              cityUserInput: cityInput,
            }}
            restaurant={{
              restaurantNameUserInput: restaurantNameInput,
              onRestaurantNameUserInputChange: onRestaurantNameUserInputChange,
              restaurantData: restaurantData,
            }}
          />
          <div>` yolo ${zipcodeInput}`</div>
        </div>
      )}
    </React.Fragment>
  );
};
