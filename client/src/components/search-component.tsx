import * as React from "react";
import { TextInput, Button, Group } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { Autocomplete } from "@mantine/core";
import rawLocations from "../location.json";

// https://simplemaps.com/data/us-zips this need to be added to usa zipcode data

// This is for setting filter
// Chip.Group controlled cip group for multi filter select for search
// transfer list for a card generation

export interface PropertiesProps {
  title: string;
  city: string;
  state: string;
  zip: string;
  index: number;
}

export interface RawData {
  features: {
    type: string;
    properties: PropertiesProps;
    geometry: { coordinates: [number, number]; type: "Point" };
  }[];
}
const allRawData: RawData = JSON.parse(JSON.stringify(rawLocations));

// we need to remove duplicate city values
const citySet = new Set();

// We are combining city,state here and adding entries to set
const formattedData = allRawData.features.map((item: any) => {
  const properties = item.properties;
  const formattedData = {
    ...item,
    value: `${properties.city}, ${properties.state}`,
  };
  citySet.add(formattedData.value);
  return { ...item, value: `${properties.city}, ${properties.state}` };
});

// city data: convert back to array to use with mantine
const cityData: any = Array.from(citySet);
// zipcode
const zipData = allRawData.features.map((item: any) => ({
  ...item,
  value: item.properties.zip,
}));

export type ZipCodeInputProps = {
  zipcodeValue: string;
  onZipcodeChange: (value: string) => void;
  errorZipcode: boolean;
  cityValue: string;
  onCityValueChange: (value: string) => void;
  errorCity: boolean;
};
export const ZipCodeInput: React.FC<ZipCodeInputProps> = ({
  zipcodeValue,
  onZipcodeChange,
  errorZipcode,
  cityValue,
  onCityValueChange,
  errorCity,
}) => {
  // TODO: change on submit function
  // It needs to distinguish between zip code, state, city,state so check for each value when submitting and which triggered
  // remove white spaces from string and check length
  // TODO: If i want to avoid type checking in submit try finding mantine disbale submit button
  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Do type checking for zipcode and length of zipcode
    if (!errorZipcode && zipcodeValue.length === 5) {
      // TODO: set Search query for zipcode
    }
    console.log("submit valiue", zipcodeValue);
    // TODO: set trigger search to true, reset the value
  };

  if (!errorZipcode && !errorCity) {
    return (
      <Group position="center" spacing="xl" grow={true}>
        <Autocomplete
          label="zipcode"
          placeholder="Start typing"
          value={zipcodeValue}
          limit={7}
          onChange={onZipcodeChange}
          data={zipData}
        />
        <Autocomplete
          label="city"
          placeholder="start typing"
          value={cityValue}
          limit={7}
          onChange={onCityValueChange}
          data={cityData}
        />
        <Button onClick={onSubmit}>Submit</Button>
      </Group>
    );
  } else if (errorZipcode && !errorCity) {
    return (
      <Group position="center" spacing="xl">
        <Autocomplete
          label="Zip code"
          error="Please provide valid zipcode"
          onChange={onZipcodeChange}
          data={zipData}
          value={zipcodeValue}
        />
        <Autocomplete
          label="city"
          placeholder="start typing"
          value={cityValue}
          limit={7}
          onChange={onCityValueChange}
          data={cityData}
        />
        <Button onClick={onSubmit}>Submit</Button>
      </Group>
    );
  } else if (!errorZipcode && errorCity) {
    return (
      <Group position="center" spacing="xl">
        <Autocomplete
          label="zipcode"
          placeholder="Start typing"
          value={zipcodeValue}
          limit={7}
          onChange={onZipcodeChange}
          data={zipData}
        />
        <Autocomplete
          label="city"
          error="Pkease provide valid city"
          placeholder="start typing"
          value={cityValue}
          onChange={onCityValueChange}
          data={cityData}
        />
        <Button onClick={onSubmit}>Submit</Button>
      </Group>
    );
  } else {
    return (
      <Group position="center" spacing="xl">
        <Autocomplete
          label="Zip code"
          error="Please provide valid zipcode"
          onChange={onZipcodeChange}
          data={zipData}
          value={zipcodeValue}
        />
        <Autocomplete
          label="city"
          error="Pkease provide valid city"
          placeholder="start typing"
          value={cityValue}
          onChange={onCityValueChange}
          data={cityData}
        />
        <Button onClick={onSubmit}>Submit</Button>
      </Group>
    );
  }

  // return !errorZipcode ? (
  //   <Group position="center" spacing="xl" grow={true}>
  //     <Autocomplete
  //       label="zipcode"
  //       placeholder="Start typing"
  //       value={zipcodeValue}
  //       limit={7}
  //       onChange={onZipcodeChange}
  //       data={zipData}
  //     />
  //     <Autocomplete
  //       label="city"
  //       placeholder="start typing"
  //       value={cityValue}
  //       limit={7}
  //       onChange={onCityValueChange}
  //       data={cityData}
  //     />
  //     <Button onClick={onSubmit}>Submit</Button>
  //   </Group>
  // ) : (
  //   <Group position="center" spacing="xl">
  //     <Autocomplete
  //       label="Zip code"
  //       error="Please provide valid zipcode"
  //       onChange={onZipcodeChange}
  //       data={zipData}
  //       value={zipcodeValue}
  //     />
  //     <Button onClick={onSubmit}>Submit</Button>
  //   </Group>
  // );
};

export const SearchInput: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [triggerSearch, setTriggerSearch] = React.useState(false);

  const onSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      //Filter results with value
      console.log(value);
    }
    //TODO: Reset the value if the search term
  };
  const onBlur = () => {
    console.log(value);
  };

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
