import * as React from "react";
import { Title, Text, MediaQuery, Card, Box, Flex } from "@mantine/core";
import { SearchInput } from "../searchInput";
// local imports

export const SearchWithText: React.FC = ({}) => {
  return (
    <Card style={{ backgroundColor: "inherit" }}>
      <Card.Section>
        <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
          <Title size={"h1"} order={1}>
            {" "}
            Find halal food with ease
          </Title>
        </MediaQuery>
        <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
          <Title size={"h3"} order={1}>
            {" "}
            Find halal food with ease
          </Title>
        </MediaQuery>
        <Text size="md" mt="sm" color="dimmed">
          Discover halal food options with our integrated map search.
        </Text>
        <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
          <Text size="md" mt="sm" color="dimmed">
            Use the search button to start exploring now.
          </Text>
        </MediaQuery>
        <Flex gap="md" pt="sm" direction={"column"}>
          <SearchInput />
        </Flex>
      </Card.Section>
    </Card>
  );
};
