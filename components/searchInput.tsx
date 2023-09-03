import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, Button, Grid, Loader } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
// local imports
import { ErrorCard } from ".";
import { getGeogAutoComplete } from "@/utils/crudFunctions";

export const SearchInput: React.FC = () => {
  const router = useRouter();
  const [autoCompleteInputValue, setAutoCompleteInputValue] =
    React.useState("");
  const [error, setError] = React.useState({ inputData: "" });
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
    console.log(geogData.error);
    return <ErrorCard message="something went wrong with the server" />;
  }
  const parsedZipcode = geogData.data?.zipcode?.map(
    (item) => `${item.zipcode}, ${geogData.data.country?.countryName}`
  );

  const parsedCity = geogData.data.city?.map(
    (city) =>
      `${city.cityName}, ${city.stateName}, ${geogData.data.country?.countryName}`
  );
  const mergedData = [...parsedZipcode!, ...parsedCity!];

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
    <Grid>
      <Grid.Col md={12} lg={9}>
        <Autocomplete
          error={geogData.isError}
          placeholder={
            geogData.isError
              ? "uanble to load data from the server"
              : "search restaurants by city, zipcode, neighborhood"
          }
          icon={<IconSearch />}
          data={!geogData.isError ? mergedData : []}
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
      <Grid.Col md={12} lg={3}>
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
              [theme.fn.smallerThan("lg")]: {
                width: "100%",
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