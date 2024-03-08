import * as React from "react";
import { useRouter } from "next/router";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapProvider } from "react-map-gl";
import { Loader } from "@mantine/core";
// local imports
import { parseQueryVals } from "@/utils";
import { SearchInput, MapAndList } from "@/components";

const MapSearch: React.FC = () => {
  const router = useRouter();
  const urlParams = router.query;
  const { country, zipcode, city, state } = urlParams;
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    // since this is a client component, during initial two renders, urlParams is empty
    if (city || zipcode) {
      city
        ? setQuery(`country=${country}&state=${state}&city=${city}`)
        : setQuery(`country=${country}&zipcode=${zipcode}`);
    }
  }, [country, zipcode, city, state]);

  // we are doing this so that when we navigate our search input populates with appropriate values
  let searchInputVal = "";
  if (city) {
    searchInputVal = `${city}, ${state}, ${country}`;
  } else {
    searchInputVal = `${zipcode}, ${country}`;
  }
  const mapAndListProps = {
    query,
    setQuery,
    urlParams,
  };

  return query.length ? (
    <>
      <SearchInput queryString={searchInputVal} />{" "}
      <MapProvider>
        <MapAndList {...mapAndListProps} />
      </MapProvider>
    </>
  ) : (
    <Loader />
  );
};

export default MapSearch;
