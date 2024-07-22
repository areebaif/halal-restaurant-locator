import * as React from "react";
import { useRouter } from "next/router";
import { MapProvider } from "react-map-gl";
import { Loader, Flex, Group } from "@mantine/core";
// local imports
import { SearchInput, MapAndList } from "@/components";

const MapSearch: React.FC = () => {
  const router = useRouter();
  const urlParams = router.query;

  return urlParams.zipcode?.length ||
    urlParams.city?.length ||
    urlParams.latitude?.length ? (
    <>
      <Flex
        sx={(theme) => ({
          [theme.fn.largerThan("md")]: { display: "none" },
        })}
        gap="md"
        direction={"column"}
      >
        <SearchInput />
      </Flex>
      <Group
        spacing="md"
        sx={(theme) => ({
          [theme.fn.smallerThan("md")]: { display: "none" },
        })}
        grow={true}
      >
        <SearchInput />
      </Group>
      <MapProvider>
        <MapAndList />
      </MapProvider>
    </>
  ) : (
    <Loader />
  );
};

export default MapSearch;
