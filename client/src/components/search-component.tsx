import * as React from "react";
import { TextInput, Button } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { Autocomplete } from "@mantine/core";

import cities from "../cities.json";

// https://simplemaps.com/data/us-zips this need to be added to usa zipcode data
// Chip.Group controlled cip group for multi filter select for search
// transfer list for a card generation

const SearchInput: React.FC = () => {
  console.log(cities);
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

export default SearchInput;
