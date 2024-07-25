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
  Tooltip,
  UnstyledButton,
  Pagination,
} from "@mantine/core";
import { ErrorCard } from "@/components";
import { ListCities, ListCitiesError } from "@/utils/types";
import {
  IconChevronLeft,
  IconChevronsLeft,
  IconChevronRight,
  IconChevronsRight,
  IconSortAscendingLetters,
} from "@tabler/icons-react";
import { listCities } from "@/utils/crud-functions";

const ListCity: React.FC = () => {
  const router = useRouter();

  const country = router.query.country;
  const state = router.query.stateId;
  const page = router.query._page;
  const limit = router.query._limit;

  const countryName = country as string;
  const stateId = state as string;
  const pageNumber = page as string;
  const limitNum = limit as string;

  const [pageNum, setPageNum] = React.useState(
    pageNumber ? parseInt(pageNumber) : 1
  );
  React.useEffect(() => {
    if (page) setPageNum(parseInt(pageNumber));
  }, [page]);

  const getCities = useQuery(
    ["listCities", stateId, pageNum, limitNum],
    () => listCities(stateId, pageNum.toString(), limitNum),
    {
      enabled: page ? true : false,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  if (getCities.isLoading || getCities.isFetching) return <Loader />;
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
  const maxPageNum = Math.ceil(cityData.totalCount / parseInt(limitNum));
  const paginationButtonProps = {
    cityData,
    pageNum,
    stateId,
    countryName,
    limitNum,
  };
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
      <Pagination
        withEdges
        radius="xs"
        color="gray"
        position="center"
        value={pageNum}
        onChange={(val) => {
          console.log(val, "sksksk, onchange");
          setPageNum(val);
          router.push(
            `/country/${countryName}/state/${stateId}?_limit=${limitNum}&_page=${val}`
          );
        }}
        total={maxPageNum}
      />
    </>
  );
};

type PaginationButtons = {
  pageNum: number;
  cityData: ListCities;
  countryName: string;
  stateId: string;
  limitNum: string;
};

export default ListCity;
