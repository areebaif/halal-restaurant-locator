import * as React from "react";
import { Center, Box } from "@mantine/core";
// local imports
import { HeroText } from "./HeroText";
import { SearchInput } from "../searchInput";

export const HeroHeader: React.FC = ({}) => {
  return (
    <Center
      px="xl"
      mx="md"
      py="md"
      //my="xl"
      sx={(theme) => ({
        color: theme.white,
        [theme.fn.smallerThan("sm")]: {
          color: theme.colors.dark[5],
        },
      })}
    >
      <Box>
        <HeroText />
      </Box>
    </Center>
  );
};
