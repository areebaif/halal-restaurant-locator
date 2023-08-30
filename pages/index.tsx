//import * as React from "react";
import * as React from "react";
import { AppProps } from "next/app";
import { Box, BackgroundImage, Flex } from "@mantine/core";
import { HeroHeader, SearchInput } from "@/components";

const Home = (props: AppProps) => {
  return <HeroHeaderSearch />;
};
export default Home;

export const HeroHeaderSearch: React.FC = ({}) => {
  return (
    <Box>
      <BackgroundImage
        sx={(theme) => ({
          [theme.fn.smallerThan("sm")]: {
            backgroundImage: "none",
          },
        })}
        src={"./hero-image.png"}
      >
        <Flex
          sx={(theme) => ({
            [theme.fn.smallerThan("sm")]: {
              width: "100%",
            },
            width: "50%",
          })}
          direction="column"
        >
          <Flex
            sx={(theme) => ({
              [theme.fn.smallerThan("sm")]: {
                width: "100%",
              },
              width: "80%",
            })}
          >
            <HeroHeader />
          </Flex>
          <Box mb="xl" pb="xl" pt="md" pl="xl" ml="md">
            <SearchInput />
          </Box>
        </Flex>
      </BackgroundImage>
    </Box>
  );
};
