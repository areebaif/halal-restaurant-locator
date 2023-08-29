//import * as React from "react";
import * as React from "react";
import { AppProps } from "next/app";
import { useAppSelector, useAppDispatch } from "@/redux-store/redux-hooks";
import { setAutoCompleteGeogData } from "@/redux-store/geography-slice";

import {
  Box,
  BackgroundImage,
  Flex,
  Autocomplete,
  Loader,
} from "@mantine/core";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getGeogAutoComplete } from "@/utils/crudFunctions";

import { HeroHeader } from "@/components";
import { ResponseGetAllGeog } from "@/utils/types";

const Home = (props: AppProps) => {
  const dispatch = useAppDispatch();
  const [isFetchError, setIsFetchError] = React.useState(false);
  // Queries
  const geogData = useQuery(
    ["getGeographyAutoCompleteData"],
    getGeogAutoComplete,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
  if (geogData.isLoading) return <Loader />;
  if (geogData.isError) {
    setIsFetchError(true);
  }
  const reduxGeog = {
    geography: geogData.data!,
    isError: isFetchError,
  };
  const geographyData = dispatch(setAutoCompleteGeogData(reduxGeog));
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
            width: "40%",
          })}
        >
          <HeroHeader />
        </Flex>
      </BackgroundImage>
    </Box>
  );
};
