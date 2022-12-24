import * as React from "react";
import { Autocomplete, Button, Group, AutocompleteItem } from "@mantine/core";

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

export default AutoCompleteInput;
