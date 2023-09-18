import * as React from "react";
import {
  Card,
  Title,
  TextInput,
  Group,
  Button,
  Textarea,
  NumberInput,
} from "@mantine/core";

const AddRestaurant: React.FC = () => {
  const [name, setName] = React.useState("");
  const [state, setState] = React.useState("");
  const [city, setCity] = React.useState("");
  const [latitude, setLatitude] = React.useState<number|string>(" ");

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{
        overflow: "inherit",
        margin: "15px 0 0 0",
      }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Add Restaurant</Title>
      </Card.Section>
      <TextInput
        mt="xs"
        withAsterisk
        label="Name"
        value={name}
        placeholder="type here"
        type="text"
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <TextInput
        mt="xs"
        withAsterisk
        label="State"
        value={name}
        placeholder="type here"
        type="text"
        onChange={(event) => setName(event.currentTarget.value)}
      />
      {/* This need to be autocomplete with data from backend */}
      <TextInput
        mt="xs"
        withAsterisk
        label="City"
        value={name}
        placeholder="type here"
        type="text"
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <NumberInput value={latitude} onChange={setLatitude} />
      <Group position="center" mt="sm">
        <Button variant="outline" color="dark" size="sm" type="submit">
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddRestaurant;
