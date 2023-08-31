import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import Map, { useMap, MapProvider } from "react-map-gl";
import { Loader, Grid } from "@mantine/core";
// local imports
import { getMapSearchInput, calcBoundsFromCoordinates } from "@/utils";
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
  const urlParams = router.query.searchParams as string[];
  const [query, setQuery] = React.useState("");
  const [flag, setFlag] = React.useState(false);
  const [hoverId, setHoverId] = React.useState<number | string | undefined>(
    undefined
  );
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
  return (
    <>
      <SearchInput />
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
