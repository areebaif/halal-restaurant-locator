import * as React from "react";
import { TextInput, Button, Group } from "@mantine/core";
import { useQuery } from "react-query";
import { IconSearch } from "@tabler/icons";
import { Autocomplete } from "@mantine/core";
import { PropertiesProps } from "./map-layout";

// TODO: this component should populate its own data from backend

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
  zipcodeValue: string;
  onZipcodeChange: (value: string) => void;
  errorZipcode: boolean;
  cityValue: string;
  onCityValueChange: (value: string) => void;
  errorCity: boolean;
  stateValue: string;
  onStateValueChange: (value: string) => void;
  errorState: boolean;
  //citySet: Set<string>;
  //stateSet: Set<string>;
  // TODO: fix typing
  //zipData: any[];
}
export const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  zipcodeValue,
  onZipcodeChange,
  errorZipcode,
  cityValue,
  onCityValueChange,
  errorCity,
  stateValue,
  onStateValueChange,
  errorState,
  //stateSet,
  //citySet,
  //zipData,
}) => {
  // Fetching Data
  const [stateData, setStateData] = React.useState<string[]>();
  const [cityData, setCityData] = React.useState<string[]>();
  const [zipData, setZipData] = React.useState<any>();
  const URL = "/api/dev/getGeography";
  const { isLoading, isError, data, error } = useQuery(
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
        };
      } = await response.json();
      return data.data;
    },
    {
      onSuccess: (data) => {
        setStateData(data.stateSet);
        setCityData(data.citySet);
        const zipFormattedData = data.zipSet.map((item: ZipDocument) => ({
          ...item,
          value: item.properties.zip,
        }));
        setZipData(zipFormattedData);
      },
    }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: error occured</span>;
  }

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: set Search term for either zipcode, state, or citystate or all
    // We dont need to do type checking as submit button disables if a user enters invalid input
    // TODO:
    // The only thing we need to check for is white spaces and capslock every first letter
    const trimmedCity = cityValue.trim();
    const trimmedState = stateValue.trim();

    // TODO: set trigger search to true, reset the value
  };
  return (
    <Group position="center" spacing="xl" grow={true}>
      {errorZipcode ? (
        <Autocomplete
          label="Zip code"
          error="Please provide valid zipcode"
          onChange={onZipcodeChange}
          data={[]}
          value={zipcodeValue}
        />
      ) : (
        <Autocomplete
          label="zipcode"
          placeholder="Start typing"
          value={zipcodeValue}
          limit={7}
          onChange={onZipcodeChange}
          data={zipData ? zipData : []}
        />
      )}
      {errorCity ? (
        <Autocomplete
          label="city"
          error="Please provide valid city"
          placeholder="start typing"
          value={cityValue}
          onChange={onCityValueChange}
          data={[]}
        />
      ) : (
        <Autocomplete
          label="city"
          placeholder="start typing"
          value={cityValue}
          limit={7}
          onChange={onCityValueChange}
          data={cityData ? cityData : []}
        />
      )}
      {errorState || (cityValue.length > 0 && stateValue.length === 0) ? (
        <Autocomplete
          label="state"
          error={`${
            cityValue.length > 0 && stateValue.length === 0
              ? "state required if you are searching by city"
              : "Please provide valid state value"
          }`}
          placeholder={`${
            cityValue.length > 0 && stateValue.length === 0
              ? ""
              : "start typing"
          }`}
          value={stateValue}
          onChange={onStateValueChange}
          data={[]}
        />
      ) : (
        <Autocomplete
          label="state"
          placeholder="start typing"
          value={stateValue}
          limit={7}
          onChange={onStateValueChange}
          data={stateData ? stateData : []}
          required={cityValue.length > 0}
        />
      )}
      <Button
        disabled={
          errorCity ||
          errorZipcode ||
          errorState ||
          (cityValue.length > 0 && stateValue.length === 0)
        }
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Group>
  );
};

// This is anoher search input
export const SearchInput: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [triggerSearch, setTriggerSearch] = React.useState(false);

  const onSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      //Filter results with value
    }
    //TODO: Reset the value if the search term
  };
  const onBlur = () => {};

  const onsubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // set trigger search to true
    // reset the value
  };

  return (
    <React.Fragment>
      <TextInput
        value={value}
        onChange={onSearchTermChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        icon={<IconSearch size={16} stroke={1.5} />}
        placeholder="Search by name"
      />
      <Button onSubmit={onsubmit}>Submit</Button>
    </React.Fragment>
  );
};
