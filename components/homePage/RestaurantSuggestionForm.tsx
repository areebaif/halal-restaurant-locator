import * as React from "react";
import { Flex, TextInput } from "@mantine/core";

export const RestaurantSuggestionForm: React.FC = () => {
  return (
    <>
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
    </>
  );
};
