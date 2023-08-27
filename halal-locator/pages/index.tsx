//import * as React from "react";
import { AppProps } from "next/app";
import { Box, BackgroundImage, Flex, Autocomplete } from "@mantine/core";

import { HeroText } from "@/components";

const Home = (props: AppProps) => {
  return <HeroHeader />;
};
export default Home;

export const HeroHeader: React.FC = () => {
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
            width: "40%",
          })}
        >
          <HeroText />
          
        </Flex>
      </BackgroundImage>
    </Box>
  );
};
