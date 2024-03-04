import * as React from "react";
import { Group, TextInput, Textarea, Button, Grid } from "@mantine/core";

export const SearchZipcode: React.FC = () => {
  const [zipcode, setZipcode] = React.useState("");

  const onSubmit = (zipcode: string) => {
    // TODO: do a search for zipcode at the backend
  };

  return (
    <Grid mt="xs">
      <Grid.Col span={2}>
        <Textarea
          label={"zipcode"}
          defaultValue="search five digit zipcode to auto populate the state and city."
        
          disabled
          withAsterisk
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <TextInput
          mt="md"
          value={zipcode}
          onChange={(event) => setZipcode(event.currentTarget.value)}
          label={"search"}
          placeholder="five digit zipcode"
        ></TextInput>
      </Grid.Col>
      <Grid.Col span={2}>
        <Button
          sx={(theme) => ({
            marginTop: `calc(${theme.spacing.lg}*2)`,
          })}
          variant="outline"
          color="dark"
          onClick={() => onSubmit(zipcode)}
        >
          Search
        </Button>
      </Grid.Col>
    </Grid>
  );
};
