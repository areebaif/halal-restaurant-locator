import * as React from "react";
import { Flex, TextInput, Button, Card, Title, Text } from "@mantine/core";

export const RestaurantSuggestionForm: React.FC = () => {
  // TODO: have to wire up functionality
  return (
    <Card shadow="xs" radius="md" withBorder>
      <Title order={2}>Help us grow our library</Title>
      <Text>Do you know a restaurant that is not on our website?</Text>
      <Text>
        Tell us the name and adress of the restaurant and we will do the rest!!
      </Text>
      <TextInput
        placeholder="enter here"
        label="restaurant name"
        withAsterisk
      />
      <TextInput
        placeholder="please include street, city, zipcode"
        label="adress"
        withAsterisk
      />
      <Button>Submit</Button>
    </Card>
  );
};
