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
import { listStates } from "@/utils";
import { ListStateError, ListStates } from "@/utils/types";
import { IconSortAscendingLetters } from "@tabler/icons-react";

const ListState: React.FC = () => {
  const router = useRouter();
  const country = router.query.country;
  const countryName = country as string;
  const getRestaurant = useQuery(["listStates"], () => listStates(), {
    enabled: country ? true : false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (getRestaurant.isLoading) return <Loader />;
  if (getRestaurant.isError)
    return <ErrorCard message="something went wrong please try again" />;
  const data = getRestaurant.data;
  if (data.hasOwnProperty("apiErrors")) {
    const errors = data as ListStateError;

    if (errors.apiErrors?.generalError)
      <ErrorCard arrayOfErrors={errors.apiErrors?.generalError} />;
  }
  // it is safe to assume we have the states
  const stateData = data as ListStates;

  return (
    <>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Group position="apart">
          <Title size={"h2"} order={1}>
            {countryName}
          </Title>
          <IconSortAscendingLetters color="gray" />
        </Group>
      </MediaQuery>
      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Group position="apart">
          <Title size={"h3"} order={1}>
            {countryName}
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
        {stateData.map((state) => (
          <Button
            key={state.stateId}
            onClick={() => {
              router.push(
                `/country/${countryName}/state/${
                  state.stateId
                }?_limit=${50}&_page=${1}`
              );
            }}
            size="lg"
            variant="subtle"
            color="dark"
          >
            {state.stateName}
          </Button>
        ))}
      </SimpleGrid>
    </>
  );
};

export default ListState;
