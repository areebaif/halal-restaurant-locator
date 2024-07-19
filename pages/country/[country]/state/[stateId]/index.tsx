import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Loader,
  SimpleGrid,
  Divider,
  MediaQuery,
  Title,
  Group,
} from "@mantine/core";
import { ErrorCard } from "@/components";
import { ListCities, ListCitiesError } from "@/utils/types";
import { IconSortAscendingLetters } from "@tabler/icons-react";
import { listCities } from "@/utils/crud-functions";

// TODO: pagination!!! there is too much city data like 300 entries for each state

const ListCity: React.FC = () => {
  const router = useRouter();
  const country = router.query.country;
  const state = router.query.stateId;
  const countryName = country as string;
  const stateId = state as string;
  console.log(countryName, stateId);
  const getCities = useQuery(
    ["listCities", stateId],
    () => listCities(stateId),
    {
      enabled: state ? true : false,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  if (getCities.isLoading) return <Loader />;
  if (getCities.isError)
    return <ErrorCard message="something went wrong please try again" />;
  const data = getCities.data;
  if (data.hasOwnProperty("apiErrors")) {
    const errors = data as ListCitiesError;

    if (errors.apiErrors?.generalError)
      <ErrorCard arrayOfErrors={errors.apiErrors?.generalError} />;
  }
  // it is safe to assume we have the states
  const cityData = data as ListCities;
  const cities: { cityId: string; cityName: string }[] = [];
  let stateName = "";
  for (const [property, value] of Object.entries(cityData.stateName)) {
    stateName = property;
    value.forEach((element) => {
      cities.push(element);
    });
  }
  return (
    <>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Group position="apart">
          <Title size={"h2"} order={1}>
            {`Cities in ${stateName}`}
          </Title>
          <IconSortAscendingLetters color="gray" />
        </Group>
      </MediaQuery>
      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Group position="apart">
          <Title size={"h3"} order={1}>
            {`Cities in ${stateName}`}
          </Title>
          <IconSortAscendingLetters color="gray" />
        </Group>
      </MediaQuery>
      <Divider my="sm" />
      <SimpleGrid
        cols={5}
        spacing="md"
        breakpoints={[
          { maxWidth: "xl", cols: 5, spacing: "md" },
          { maxWidth: "lg", cols: 4, spacing: "md" },
          { maxWidth: "md", cols: 3, spacing: "md" },
          { maxWidth: "sm", cols: 2, spacing: "sm" },
          { maxWidth: "xs", cols: 1, spacing: "sm" },
        ]}
      >
        {cities.map((city) => (
          <Button
            key={city.cityId}
            onClick={() => {
              // TODO: this will take you to map page
              //router.push(`/country/${countryName}/state/${city.stateName}`);
            }}
            size="lg"
            variant="subtle"
            color="dark"
          >
            {city.cityName}
          </Button>
        ))}
      </SimpleGrid>
    </>
  );
};

export default ListCity;
