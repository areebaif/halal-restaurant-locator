//import * as React from "react";
import { AppProps } from "next/app";
import { Box, BackgroundImage, Flex, Autocomplete } from "@mantine/core";

import { HeroHeader } from "@/components";

const Home = (props: AppProps) => {
  return <HeroHeaderSearch />;
};
export default Home;

export const HeroHeaderSearch: React.FC = () => {
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
          <HeroHeader />
        </Flex>
      </BackgroundImage>
    </Box>
  );
};
