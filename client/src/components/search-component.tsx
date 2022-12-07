import * as React from "react";
import { TextInput, Button, Group, AutocompleteItem } from "@mantine/core";
import { useQuery } from "react-query";
import { IconSearch } from "@tabler/icons";
import { Autocomplete } from "@mantine/core";
import { SearchTerms } from "./search-map-display";
import { isTemplateExpression } from "typescript";
import { StringifyOptions } from "querystring";

// TODO: Restaurant document interface, data modelling and hook it up to backend

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

export interface AutoCompleteInputProps {
  zipcodeUserInput: string;
  onZipcodeUserInputChange: (value: string) => void;
  errorZipcodeUserInput: boolean;
  cityUserInput: string;
  onCityUserInputChange: (value: string) => void;
  errorCityUserInput: boolean;
  stateUserInput: string;
  onStateUserInputChange: (value: string) => void;
  errorStateUserInput: boolean;
  onSearch: (data: SearchTerms) => void;
  restaurantNameUserInput: string;
  onRestaurantNameUserInputChange: (value: string) => void;
}

export const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  zipcodeUserInput,
  onZipcodeUserInputChange,
  errorZipcodeUserInput,
  cityUserInput,
  onCityUserInputChange,
  errorCityUserInput,
  stateUserInput,
  onStateUserInputChange,
  errorStateUserInput,
  onSearch,
  restaurantNameUserInput,
  onRestaurantNameUserInputChange,
}) => {
  const [stateData, setStateData] = React.useState<AutocompleteItem[]>();
  const [cityData, setCityData] = React.useState<AutocompleteItem[]>();
  // we are using zipData to populate mantine autocomplete component.This component has typing defined as AutoCompleteItem
  const [zipData, setZipData] = React.useState<AutocompleteItem[]>();
  // we are using restaurantData to populate mantine autocomplete component.This component has typing defined as AutoCompleteItem
  const [restaurantData, setRestaurantData] =
    React.useState<AutocompleteItem[]>();

  // This function has to run regardless of any user input to populate auto-complete inputs of state, city, zipcode and restaurantName
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
        console.log("data", data);
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
    return <span>Error: error occured</span>;
  }

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: before triggering a backend api call, we have to sanitize input and check whether the user has entered a valid stateName, cityName e.t.c

    let trimmedZipCode = zipcodeUserInput?.trim();
    let trimmedCity = cityUserInput?.trim();
    let trimmedState = stateUserInput?.trim();
    let trimmedRestaurantNameUserInput = restaurantNameUserInput?.trim();

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
    if (trimmedZipCode.length) {
      //TODO: check valid zipcode
      onZipcodeUserInputChange(trimmedZipCode);
    }

    // TODO: check if it is a valid entry using state, city, zipcode data

    onSearch({
      zipcodeUserInput: trimmedZipCode,
      cityUserInput: trimmedCity,
      stateUserInput: trimmedState,
      restaurantNameUserInput: trimmedRestaurantNameUserInput,
    });
  };
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
            placeholder="Start typing to see options"
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
            placeholder="Start typing to see options"
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
            placeholder="Start typing to see options"
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
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Group>
    </React.Fragment>
  );
};
