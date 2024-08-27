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
          [theme.fn.largerThan("md")]: { flexDirection: "row" },
          [theme.fn.smallerThan("md")]: { flexDirection: "column" },
        })}
        gap="md"
      >
        <SearchInput />
      </Flex>

      <MapProvider>
        <MapAndList />
      </MapProvider>
    </>
  ) : (
    <Loader />
  );
};

export default MapSearch;
