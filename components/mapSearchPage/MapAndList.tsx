import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import Map, { useMap } from "react-map-gl";
import { Loader, Grid } from "@mantine/core";
import {
  calcBoundsFromCoordinates,
  GeoJsonFeatureCollectionRestaurantsZod,
  listRestaurantBySearchCriteria,
  FilterRestaurantResponseZod,
} from "@/utils";

import { ErrorCard, MapContainer, SearchResultList } from "@/components";
import {
  FilterRestaurantsErrors,
  RestaurantGeoJsonFeatureCollectionClient,
} from "@/utils/types";

export type MapAndList = {
  query: string;
  setQuery: (val: string) => void;
};

export const MapAndList: React.FC<MapAndList> = ({ query, setQuery }) => {
  const { MapA } = useMap();
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
    () => listRestaurantBySearchCriteria(query),
    {
      onSuccess(data) {
        const result = FilterRestaurantResponseZod.safeParse(data);
        if (!result.success) {
          console.log(result.error);
          return (
            <ErrorCard message="the server responded with incorrect types, but the restaurant may have been created in the database" />
          );
        }
        if (data.hasOwnProperty("apiErrors")) {
          const apiErrors = data as FilterRestaurantsErrors;
          if (apiErrors.apiErrors?.generalErrors) {
            return (
              <ErrorCard message="something went wrong, please try again" />
            );
          }
          if (apiErrors.apiErrors?.validationErrors) {
            const errorsProps = apiErrors.apiErrors.validationErrors;
            const { zipcode, city, state, country } = errorsProps;
            let errors: string[] = [];
            if (zipcode) errors = [...errors, ...zipcode];
            if (country) errors = [...errors, ...country];
            if (state) errors = [...errors, ...state];
            if (city) errors = [...errors, ...city];
            return <ErrorCard arrayOfErrors={errors} />;
          }
        }
        setFlag(true);
      },
    }
  );

  React.useEffect(() => {
    if (query.length) {
      const correctData =
        mapData.data as RestaurantGeoJsonFeatureCollectionClient;
      if (correctData && correctData.restaurants?.features.length) {
        const mapBounds = calcBoundsFromCoordinates(correctData.restaurants);
        MapA?.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
        setFlag(false);
      }
    }
  }, [query, flag]);

  if (mapData.isLoading) {
    return <Loader />;
  }

  if (mapData.isError) {
    return <ErrorCard message="unable to load data from the server" />;
  }

  const isTypeCorrect = GeoJsonFeatureCollectionRestaurantsZod.safeParse(
    mapData.data
  );
  if (!isTypeCorrect.success) {
    console.log(isTypeCorrect.error);
    return <ErrorCard message="There is a type mismatch from the server" />;
  }
  const correctData = mapData.data as RestaurantGeoJsonFeatureCollectionClient;
  if (!correctData.restaurants) {
    const data = correctData;
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
  const geolocations = correctData.restaurants;

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
    <Grid>
      <Grid.Col span={4}>
        <SearchResultList {...mapConatinerInputs} />
      </Grid.Col>
      <Grid.Col span={8}>
        <MapContainer {...mapConatinerInputs} />
      </Grid.Col>
    </Grid>
  );
};
