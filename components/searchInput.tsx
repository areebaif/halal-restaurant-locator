import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete, Button, Grid, Loader } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
// local imports
import { ErrorCard } from ".";
import { listUSAGeog, mapCountryData } from "@/utils";
import { ListCountryError, ListGeography } from "@/utils/types";

export type SearchInput = {
  queryString?: string;
};

export const SearchInput: React.FC<SearchInput> = ({ queryString }) => {
  const router = useRouter();
  const [autoCompleteInputValue, setAutoCompleteInputValue] = React.useState(
    `${queryString ? queryString : ""}`
  );
  const [apiQueryFlag, setApiQueryFlag] = React.useState(false);
  const [apiSearchTerm, setApiSearchTerm] = React.useState("");
  const [error, setError] = React.useState({ inputData: "" });
  // Queries
  const geogData = useQuery(
    ["listGeography", apiSearchTerm],
    () => listUSAGeog(apiSearchTerm),
    {
      enabled: apiQueryFlag,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
  if (geogData.error) {
    return <ErrorCard message={`something went wrong please try again`} />;
  }
  // TODO: zod typecheck
  if (geogData.data?.hasOwnProperty("apiErrors")) {
    const error = geogData.data as ListCountryError;
    let errorArray: string[] = [];
    if (error.apiErrors?.generalError?.length)
      errorArray = [...errorArray, ...error.apiErrors?.generalError];
    if (error.apiErrors?.queryParamError)
      errorArray = [...errorArray, ...error.apiErrors?.queryParamError];
    return <ErrorCard arrayOfErrors={errorArray} />;
  }
  const mergedData = geogData.data
    ? mapCountryData(geogData.data as ListGeography)
    : [];

  const onInputSearch = (val: string) => {
    if (val.length < 3 && apiQueryFlag) {
      setApiQueryFlag(false);
    } else if (val.length === 3) {
      setApiQueryFlag(true);
      setApiSearchTerm(val);
    }
  };
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
              : "search restaurants by city or zipcode"
          }
          icon={<IconSearch />}
          data={mergedData.length ? mergedData : []}
          value={autoCompleteInputValue}
          onChange={(e) => {
            setAutoCompleteInputValue(e);
            onInputSearch(e);
          }}
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
