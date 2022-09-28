import * as React from "react";
import { TextInput, Button, Group } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { Autocomplete } from "@mantine/core";
import { FeatureDocument } from "./map-layout";

// TODO: either set data in main component or trigger backend call here for updated search?
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
  citySet: Set<string>;
  stateSet: Set<string>;
  zipData: FeatureDocument[];
};
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
  stateSet,
  citySet,
  zipData,
}) => {
  // Data manupulation
  // state data: convert back to array to use with mantine
  const stateData = Array.from(stateSet);
  // city data: convert back to array to use with mantine
  const cityData = Array.from(citySet);
  // zipcode
  const zipFormattedData = zipData.map((item) => ({
    ...item,
    value: item.properties.zip,
  }));

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
          data={zipFormattedData}
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
          data={cityData}
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
          data={stateData}
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
