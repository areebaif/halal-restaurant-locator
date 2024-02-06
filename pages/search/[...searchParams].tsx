import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import Map, { useMap, MapProvider } from "react-map-gl";
import { Loader, Grid } from "@mantine/core";
// local imports
import {
  getMapSearchInput,
  calcBoundsFromCoordinates,
  parseQueryVals,
} from "@/utils";
import {
  ErrorCard,
  SearchInput,
  MapContainer,
  SearchResultList,
} from "@/components";
import { ResponseRestaurantGeoJsonZod } from "@/utils/zod/zod";

const Mapped: React.FC = () => {
  return (
    <MapProvider>
      <MapSearch />
    </MapProvider>
  );
};

export default Mapped;

const MapSearch: React.FC = () => {
  const { MapA } = useMap();
  const router = useRouter();
  const urlParams = router.query.searchParams;

  const [query, setQuery] = React.useState("");
  const [flag, setFlag] = React.useState(false);
  const [hoverId, setHoverId] = React.useState<number | string | undefined>(
    undefined
  );
  console.log(urlParams, "we are params", query);
  const [popupData, setPopupData] = React.useState({
    restaurantName: "",
    description: "",
    address: "",
    latitude: 0,
    longitude: 0,
  });
  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const mapData = useQuery(
    ["getMapData", query],
    () => getMapSearchInput(query),
    {
      onSuccess() {
        setFlag(true);
      },
    }
  );
  React.useEffect(() => {
    if (urlParams) {
      const queryVal = urlParams[0];
      setQuery(queryVal);
      if (mapData.data?.restaurants?.features.length) {
        const mapBounds = calcBoundsFromCoordinates(mapData.data.restaurants);
        MapA?.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
        setFlag(false);
      }
    }
  }, [urlParams, flag]);

  if (mapData.isLoading) {
    return <Loader />;
  }

  if (mapData.isError) {
    return <ErrorCard message="unable to load data from the server" />;
  }

  const isTypeCorrect = ResponseRestaurantGeoJsonZod.safeParse(mapData.data);
  if (!isTypeCorrect.success) {
    console.log(isTypeCorrect.error);
    return <ErrorCard message="Their is a type mismatch from the server" />;
  }

  if (!mapData.data?.restaurants) {
    const data = mapData.data;
    const { city, restaurantError, country, state, zipcode, typeError } = data!;
    let ErrorMessage = "";
    switch (true) {
      case Boolean(city?.length):
        ErrorMessage = city!;
        break;
      case Boolean(restaurantError?.length):
        ErrorMessage = restaurantError!;
        break;
      case Boolean(country?.length):
        ErrorMessage = country!;
        break;
      case Boolean(state?.length):
        ErrorMessage = state!;
        break;
      case Boolean(zipcode?.length):
        ErrorMessage = zipcode!;
        break;
      case Boolean(typeError?.length):
        ErrorMessage = typeError!;
        break;
    }
    return <ErrorCard message={ErrorMessage} />;
  }
  const geolocations = mapData.data?.restaurants;

  const mapConatinerInputs = {
    geolocations,
    showPopup,
    setShowPopup,
    hoverId,
    setHoverId,
    popupData,
    setPopupData,
  };
  // we are doing this so that when we navigate our search input populates with appropriate values
  let searchInputVal = "";
  const queryStringValFormatted = parseQueryVals(query);
  queryStringValFormatted.city
    ? (searchInputVal = `${queryStringValFormatted.city}, ${queryStringValFormatted.state}, ${queryStringValFormatted.country}`)
    : (searchInputVal = `${queryStringValFormatted.zipcode}, ${queryStringValFormatted.country}`);
  return (
    <>
      {urlParams ? <SearchInput queryString={searchInputVal} /> : <Loader />}
      <Grid>
        <Grid.Col span={4}>
          <SearchResultList {...mapConatinerInputs} />
        </Grid.Col>
        <Grid.Col span={8}>
          <MapContainer {...mapConatinerInputs} />
        </Grid.Col>
      </Grid>
    </>
  );
};
