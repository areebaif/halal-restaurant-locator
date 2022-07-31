import * as React from "react";
import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
// Chip.Group controlled cip group for multi filter select for search
// transfer list for a card generation

const SearchInput: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [triggerSearch, setTriggerSearch] = React.useState(false);

  const onSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") console.log(value);
  };
  const onBlur = () => {
    console.log(value);
  };

  return (
    <TextInput
      value={value}
      onChange={onSearchTermChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      icon={<IconSearch size={16} stroke={1.5} />}
      placeholder="Search by name or city, zipcode or zipcode"
    />
  );
};

export default SearchInput;
