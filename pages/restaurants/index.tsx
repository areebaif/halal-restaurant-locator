import * as React from "react";
import { useRouter } from "next/router";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapProvider } from "react-map-gl";
import { Loader } from "@mantine/core";
// local imports
import { SearchInput, MapAndList } from "@/components";

const MapSearch: React.FC = () => {
  const router = useRouter();
  const urlParams = router.query;

  return urlParams.zipcode?.length ||
    urlParams.city?.length ||
    urlParams.latitude?.length ? (
    <>
      <SearchInput />{" "}
      <MapProvider>
        <MapAndList />
      </MapProvider>
    </>
  ) : (
    <Loader />
  );
};

export default MapSearch;
