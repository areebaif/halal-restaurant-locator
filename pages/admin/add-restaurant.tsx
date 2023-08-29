import * as React from "react";
import { Card, Title, TextInput, Group, Button, Textarea } from "@mantine/core";

const AddRestaurant: React.FC = () => {
  const [foodTag, setFoodTag] = React.useState("");

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
        <Title order={3}>Add Food Tag</Title>
      </Card.Section>

      <TextInput
        mt="xs"
        withAsterisk
        label="Name"
        placeholder="type here"
        type="text"
        onChange={(event) => setFoodTag(event.currentTarget.value)}
      ></TextInput>

      <Group position="center" mt="sm">
        <Button variant="outline" color="dark" size="sm" type="submit">
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddRestaurant;
