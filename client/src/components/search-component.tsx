import * as React from "react";
import { TextInput, Button, Group, AutocompleteItem } from "@mantine/core";
import { useQuery } from "react-query";
import { IconSearch } from "@tabler/icons";
import { Autocomplete } from "@mantine/core";

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
  onSearch: (data: any) => void;
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
}) => {
  const [stateData, setStateData] = React.useState<string[]>();
  const [cityData, setCityData] = React.useState<string[]>();
  // we are using zipData to populate mantine autocomplete component.This component has typing defined as AutoCompleteItem
  const [zipData, setZipData] = React.useState<AutocompleteItem[]>();

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

  if (geoLocationData.isLoading) {
    return <span>Loading...</span>;
  }

  if (geoLocationData.isError) {
    return <span>Error: error occured</span>;
  }

  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: set Search term for either zipcode, state, or citystate or all
    // We dont need to do type checking as submit button disables if a user enters invalid input
    // TODO:
    // The only thing we need to check for is white spaces and capslock every first letter
    const trimZipCode = zipcodeUserInput.trim();
    const trimmedCity = cityUserInput.trim();
    const trimmedState = stateUserInput.trim();
    onSearch({
      zipcodeUserInput: trimZipCode,
      cityUserInput: trimmedCity,
      stateUserInput: trimmedState,
      nameUserInput: null,
    });

    // TODO: set trigger search to true, reset the value
  };
  return (
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
          placeholder="Start typing"
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
          placeholder="start typing"
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
          placeholder="start typing"
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
