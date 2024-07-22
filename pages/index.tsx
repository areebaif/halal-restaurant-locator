//import * as React from "react";
import * as React from "react";

import { AppProps } from "next/app";
import { AboveTheFold, RestaurantSuggestion, TopRated } from "@/components";

const Home = (props: AppProps) => {
  return (
    <>
      <AboveTheFold />
      <TopRated />
      <RestaurantSuggestion />
    </>
  );
};
export default Home;
