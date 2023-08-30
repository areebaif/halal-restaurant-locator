import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import mapboxgl, { CirclePaint, MapLayerMouseEvent } from "mapbox-gl";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { Loader } from "@mantine/core";
// local imports
import { getMapSearchInput, calcBoundsFromCoordinates } from "@/utils";
import { ErrorCard, SearchInput } from "@/components";

import { GeoJsonRestaurantProps } from "@/utils/types";
import { useAppDispatch, useAppSelector } from "@/redux-store/redux-hooks";
import { setGoelocations } from "@/redux-store/geography-slice";

const MapSearch: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const urlParams = router.query.searchParams as string[];
  const [query, setQuery] = React.useState("");
  const mapData = useQuery({
    queryKey: ["getMapData", query],
    queryFn: () => getMapSearchInput(query),
    enabled: Boolean(query.length),
  });
  React.useEffect(() => {
    if (urlParams) {
      const queryVal = urlParams[0];
      setQuery(queryVal);
    }
    if (mapData.data?.restaurants) {
      const geoJsonData = mapData.data?.restaurants;

      const restaurantGeoLocations: GeoJSON.FeatureCollection<
        GeoJSON.Geometry,
        GeoJsonRestaurantProps
      > = {
        type: "FeatureCollection",
        features: geoJsonData,
      };
      // set global state
      dispatch(setGoelocations(restaurantGeoLocations));
    }
  }, [urlParams, mapData.data]);

  if (mapData.isLoading) {
    return <Loader />;
  }
  if (mapData.isError) {
    return <ErrorCard message="unable to load data from the server" />;
  }
  if (!mapData.data?.restaurants) {
    const data = mapData.data;
    console.log(data, "slslslslsl");
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

  return (
    <>
      <SearchInput />
      <MapContainer />
    </>
  );
};

export default MapSearch;

type CameraViewState = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

export const MapContainer: React.FC = () => {
  // local state
  const mapRef = React.useRef<any>();
  const [cameraViewState, setCameraViewState] =
    React.useState<CameraViewState>();
  const mapGeolocations = useAppSelector((state) => state.geolocation);
  const { geolocations, dataSourceId, layerId } = mapGeolocations;

  const onViewStateChange = (data: CameraViewState) => {
    setCameraViewState((previousState) => {
      return { ...previousState, ...data };
    });
  };

  const onLoad = () => {
    if (mapRef.current) {
      console.log("on load ran");
      mapRef.current.loadImage(
        "/marker-icons/mapbox-marker-icon-20px-red.png",
        (error: any, image: any) => {
          if (error)
            return <ErrorCard message="unable to load markers for the map" />;
          mapRef.current.addImage("custom-marker", image);
        }
      );
      // programmatically calculate mapZoom and mapBound for initial load of data.
      const mapLocations = geolocations;
      const coordinatesArray = mapLocations?.features.map((item) => {
        const coordinatesObj = item.geometry as GeoJSON.Point;
        return coordinatesObj.coordinates;
      });
      const mapBounds = calcBoundsFromCoordinates(coordinatesArray);
      mapRef.current.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
    }
  };

  return (
    <Map
      id="MapA"
      reuseMaps={true}
      ref={mapRef}
      initialViewState={cameraViewState}
      onMove={(evt) => onViewStateChange(evt.viewState)}
      style={{ width: "100%", maxHeight: 600, minHeight: 600, height: 600 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS}
      //interactiveLayerIds={[layerId]}
      //onMouseEnter={onMouseEnter}
      onLoad={onLoad}
    >
      <Source id={dataSourceId} type="geojson" data={geolocations}>
        <Layer
          id={layerId}
          type="symbol"
          source={dataSourceId}
          layout={{
            "icon-image": "custom-marker",
            "icon-allow-overlap": true,
            "text-field": ["get", "restaurantName"],
            "text-offset": [0, 0.8],
            "text-allow-overlap": true,
          }}
          paint={{
            "icon-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              2,
            ],
          }}
        />
      </Source>
    </Map>
  );
};
