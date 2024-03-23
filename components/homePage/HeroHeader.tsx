import * as React from "react";
import { Center, Box } from "@mantine/core";
// local imports
import { HeroText } from "./HeroText";

export const HeroHeader: React.FC = ({}) => {
  return (
    <Center
      px="xl"
      mx="md"
      py="md"
      sx={(theme) => ({
        color: theme.white,
        [theme.fn.smallerThan("sm")]: {
          color: theme.colors.dark[5],
          padding: 0,
          margin: 0,
        },
      })}
    >
      <Box>
        <HeroText />
      </Box>
    </Center>
  );
};
