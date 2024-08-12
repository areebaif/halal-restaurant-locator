import * as React from "react";
import { Title, Text, MediaQuery, Card, Box, Flex } from "@mantine/core";
import { SearchInput } from "../searchInput";
// local imports

export const SearchWithText: React.FC = ({}) => {
  return (
    <Card style={{ backgroundColor: "inherit" }}>
      <Card.Section>
        <Title
          sx={(theme) => ({
            [theme.fn.smallerThan("md")]: {
              fontSize: theme.headings.sizes.h3.fontSize,
            },
            [theme.fn.largerThan("md")]: {
              fontSize: theme.headings.sizes.h1.fontSize,
            },
          })}
          size={"h1"}
          order={1}
        >
          {" "}
          Find halal food with ease
        </Title>
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
