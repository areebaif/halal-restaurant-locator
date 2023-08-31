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
import { GeoJsonRestaurantProps } from "@/utils/types";

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
  const [flag, setFlag] = React.useState(false);
  const urlParams = router.query.searchParams as string[];
  const [query, setQuery] = React.useState("");

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
      if (mapData.data?.restaurants.length) {
        const mapBounds = calcBoundsFromCoordinates(restaurantGeoLocations);
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
  const geoLocations = mapData.data?.restaurants;

  const restaurantGeoLocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonRestaurantProps
  > = {
    type: "FeatureCollection",
    features: geoLocations,
  };
  return (
    <>
      <SearchInput />
      <Grid>
        <Grid.Col span={4}>
          <SearchResultList geolocations={restaurantGeoLocations} />
        </Grid.Col>
        <Grid.Col span={8}>
          <MapContainer geolocations={restaurantGeoLocations} />
        </Grid.Col>
      </Grid>
    </>
  );
};
