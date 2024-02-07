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
  const urlParams = router.query.searchParams;
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    // since this is a client component, during initial two renders, urlParams is empty
    if (urlParams) {
      const queryVal = urlParams[0];
      setQuery(queryVal);
    }
  }, [urlParams]);

  // we are doing this so that when we navigate our search input populates with appropriate values
  let searchInputVal = "";
  const queryStringValFormatted = parseQueryVals(query);
  queryStringValFormatted.city
    ? (searchInputVal = `${queryStringValFormatted.city}, ${queryStringValFormatted.state}, ${queryStringValFormatted.country}`)
    : (searchInputVal = `${queryStringValFormatted.zipcode}, ${queryStringValFormatted.country}`);

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
