//import * as React from "react";
import * as React from "react";
import { AppProps } from "next/app";
import { Box, Container } from "@mantine/core";
import { HeroComponent, MapWithText, RestaurantSuggestion } from "@/components";

const Home = (props: AppProps) => {
  return <HeroHeaderSearch />;
};
export default Home;

export const HeroHeaderSearch: React.FC = ({}) => {
  return (
    <>
      <HeroComponent />
      <Box
        sx={(theme) => ({
          height: 75,
          [theme.fn.smallerThan("sm")]: {
            display: "none",
          },
        })}
      ></Box>
      <Container size={"xl"}>
        <MapWithText />
      </Container>
      <Box
        sx={(theme) => ({
          height: 75,
          [theme.fn.smallerThan("sm")]: {
            display: "none",
          },
        })}
      ></Box>

      <RestaurantSuggestion />
    </>
  );
};
