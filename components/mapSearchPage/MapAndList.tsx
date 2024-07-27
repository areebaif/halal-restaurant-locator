import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useMap } from "react-map-gl";
import { Loader, Flex, em, getBreakpointValue } from "@mantine/core";
import {
  ErrorCard,
  MapContainer,
  LargeVPSearchResultList,
  useViewport,
  SmallScreenSearchResultList,
} from "@/components";
import {
  calcBoundsFromCoordinates,
  listRestaurantBySearchCriteria,
  FilterRestaurantResponseSchema,
} from "@/utils";
import {
  FilterRestaurantsErrors,
  RestaurantGeoJsonFeatureCollectionClient,
} from "@/utils/types";
import { responsive_map_resize_value_pixels } from "@/utils/constants";
import { useTheme } from "@emotion/react";

// FAQ:
// Why do we have two separate list, one for small screen and one for large screen?
// On Small Screen either the map or the list, conditionally renders, hence there is no interaction between the map and the list.
// Thus, onHover functionality on individual restaurant card produces an error as map doesnt exist to center the map on that restaurant.

export const MapAndList: React.FC = () => {
  const { MapA } = useMap();
  const router = useRouter();
  const { width } = useViewport();
  const urlParams = router.query;
  const { country, zipcode, city, state, latitude, longitude } = urlParams;

  const [query, setQuery] = React.useState("");
  const [flag, setFlag] = React.useState(false);
  const [hoverId, setHoverId] = React.useState<number | string | undefined>(
    undefined
  );
  const [popupData, setPopupData] = React.useState({
    restaurantId: "",
    restaurantName: "",
    description: "",
    address: "",
    latitude: 0,
    longitude: 0,
    coverImageUrl: "",
  });
  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const [toggleSmallScreenMap, setToggleSmallScreenMap] = React.useState(
    width < responsive_map_resize_value_pixels ? true : false
  );
  console.log(width, toggleSmallScreenMap);
  const mapData = useQuery(
    ["getMapData", query],
    () => listRestaurantBySearchCriteria(query),
    {
      onSuccess(data) {
        const result = FilterRestaurantResponseSchema.safeParse(data);
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
      enabled: query.length > 0,
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

  React.useEffect(() => {
    if (city || zipcode || latitude) {
      if (city && !zipcode && !latitude)
        setQuery(`country=${country}&state=${state}&city=${city}`);
      if (zipcode && !city && !latitude)
        setQuery(`country=${country}&zipcode=${zipcode}`);
      if (latitude && !city && !zipcode)
        setQuery(`latitude=${latitude}&longitude=${longitude}`);
    }
    const correctData =
      mapData.data as RestaurantGeoJsonFeatureCollectionClient;

    if (correctData && correctData.restaurants?.features.length) {
      const mapBounds = calcBoundsFromCoordinates(correctData.restaurants);
      MapA?.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
      setFlag(false);
    }
  }, [flag, country, zipcode, city, state, latitude, longitude, query]);

  if (mapData.isLoading) {
    return <Loader />;
  }

  if (mapData.isError) {
    return <ErrorCard message="unable to load data from the server" />;
  }

  const correctData = mapData.data as RestaurantGeoJsonFeatureCollectionClient;

  const geolocations = correctData.restaurants;

  const mapConatinerInputs = {
    geolocations,
    showPopup,
    setShowPopup,
    hoverId,
    setHoverId,
    popupData,
    setPopupData,
    setToggleSmallScreenMap,
    toggleSmallScreenMap,
  };
  const smallScreenSearchResultProps = {
    geolocations,
    setToggleSmallScreenMap,
    toggleSmallScreenMap,
  };

  return (
    <>
      {width >= responsive_map_resize_value_pixels ? (
        <LargeVPSearchResultList {...mapConatinerInputs} />
      ) : (
        !toggleSmallScreenMap && (
          <SmallScreenSearchResultList {...smallScreenSearchResultProps} />
        )
      )}

      {(toggleSmallScreenMap ||
        width >= responsive_map_resize_value_pixels) && (
        <MapContainer {...mapConatinerInputs} />
      )}
    </>
  );
};
