//import * as React from "react";
import * as React from "react";
import { AppProps } from "next/app";

import {
  Box,
  BackgroundImage,
  Flex,
  Image,
  Text,
  Container,
  Center,
  Title,
  List,
  ThemeIcon,
} from "@mantine/core";
import { HeroComponent, MapWithText, SearchInput } from "@/components";
import { HeroText } from "@/components/homePage/HeroText";
import { IconCheck } from "@tabler/icons-react";

const Home = (props: AppProps) => {
  return <HeroHeaderSearch />;
};
export default Home;

export const HeroHeaderSearch: React.FC = ({}) => {
  return (
    <>
      <HeroComponent />
      <Box sx={(theme) => ({ height: 75 })}></Box>
      <Container size={"xl"}>
        <MapWithText />
      </Container>
    </>
  );
};
