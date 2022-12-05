import * as React from "react";
import { TextInput, Button, Group, AutocompleteItem } from "@mantine/core";
import { useQuery } from "react-query";
import { IconSearch } from "@tabler/icons";
import { Autocomplete } from "@mantine/core";
import { SearchTerms } from "./search-map-display";

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
  onRestaurantNameUserInputChange: (value:string) => void
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
  onRestaurantNameUserInputChange
}) => {

  const [stateData, setStateData] = React.useState<string[]>();
  const [cityData, setCityData] = React.useState<string[]>();
  // we are using zipData to populate mantine autocomplete component.This component has typing defined as AutoCompleteItem
  const [zipData, setZipData] = React.useState<AutocompleteItem[]>();
  // we are using restaurantData to populate mantine autocomplete component.This component has typing defined as AutoCompleteItem
  const [restaurantData, setRestaurantData] = React.useState<AutocompleteItem[]>()

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
          citySet: string[];
          stateSet: string[];
          zipSet: ZipDocument[];
          restaurantSet: restaurantDocument[];
        };
      } = await response.json();
      return data.data;
    },
    {
      onSuccess: (data) => {
        console.log("data",data)
        setStateData(data.stateSet);
        setCityData(data.citySet);
        const zipFormattedData = data.zipSet.map((item: ZipDocument) => ({
          ...item,
          value: item.properties.zip,
        }));
        // might throw error since we are not sending any data
        const restaurantFormattedData = data.restaurantSet.map((item: restaurantDocument) => ({
          ...item,
          value: item.name,
        }));
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
    // We dont need to do type checking as submit button disables if a user enters invalid input
    onSearch({
      zipcodeUserInput: zipcodeUserInput,
      cityUserInput: cityUserInput,
      stateUserInput: stateUserInput,
      restaurantNameUserInput: restaurantNameUserInput
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
          data={restaurantData? restaurantData : []}
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
          //disabled={Boolean(cityUserInput.length || stateUserInput.length)}
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
          //disabled={Boolean(zipcodeUserInput.length)}
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
          //disabled={Boolean(zipcodeUserInput.length)}
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