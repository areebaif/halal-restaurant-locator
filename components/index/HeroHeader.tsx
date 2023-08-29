import { Center, Autocomplete, Button, Grid, Box } from "@mantine/core";
import * as React from "react";
import { HeroText } from "./HeroText";
import { IconSearch } from "@tabler/icons-react";
import { ResponseGetAllGeog } from "@/utils/types";
import { useAppSelector } from "@/redux-store/redux-hooks";
import { ErrorCard } from "..";
import { useRouter } from "next/router";

export const HeroHeader: React.FC = ({}) => {
  return (
    <Center
      px="xl"
      py="xl"
      my="xl"
      sx={(theme) => ({
        color: theme.white,
        [theme.fn.smallerThan("sm")]: {
          color: theme.colors.dark[5],
        },
      })}
    >
      <Box>
        <HeroText />
        <GeographySearchAutoComplete />
      </Box>
    </Center>
  );
};

export const GeographySearchAutoComplete: React.FC = () => {
  const router = useRouter();
  const autoCompleteData = useAppSelector(
    (state) => state.geolocation.allGeographyData
  );
  const [autoCompleteInputValue, setAutoCompleteInputValue] =
    React.useState("");
  const [error, setError] = React.useState({ inputData: "" });
  const mergedData = [...autoCompleteData.zipcode, ...autoCompleteData.city];

  const onSubmit = (val: string) => {
    // check if zipcode or city
    const splitValue = val.split(",");
    // switch based on length
    const arrayLength = splitValue.length;
    switch (arrayLength) {
      // this is zipcode, country
      case 2: {
        const zipcode = splitValue[0].trim();
        const country = splitValue[1].trim();
        router.push(`/search/zipcode=${zipcode}&country=${country}`);
        break;
      }
      case 3: {
        const city = splitValue[0].trim();
        const state = splitValue[1].trim();
        const country = splitValue[2].trim();
        router.push(`/search/city=${city}&state=${state}&country=${country}`);
        break;
      }
      default: {
        setError({
          ...error,
          inputData: "please check your input, entered incorrect value",
        });
      }
    }
  };
  return (
    <Grid my="xl" py="xl" pl="xl">
      <Grid.Col span="auto">
        <Autocomplete
          error={autoCompleteData.isError}
          placeholder={
            autoCompleteData.isError
              ? "uanble to load data from the server"
              : "search restaurants by city, zipcode, neighborhood"
          }
          icon={<IconSearch />}
          data={!autoCompleteData.isError ? mergedData : []}
          value={autoCompleteInputValue}
          onChange={setAutoCompleteInputValue}
          styles={(theme) => ({
            input: {
              backgroundColor: theme.colors.gray[0],
              border: `1px solid`,
              "&:hover": {
                backgroundColor: theme.colors.gray[1],
              },
            },
          })}
        />
        {error.inputData ? <ErrorCard message={error.inputData} /> : <></>}
      </Grid.Col>
      <Grid.Col span="auto">
        <Button
          onClick={() => {
            onSubmit(autoCompleteInputValue);
          }}
          variant="outline"
          color="dark"
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colors.gray[0],
              border: `1px solid`,
              "&:hover": {
                backgroundColor: theme.colors.gray[1],
              },
            },
          })}
        >
          Search
        </Button>
      </Grid.Col>
    </Grid>
  );
};
