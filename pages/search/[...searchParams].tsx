import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl, { CirclePaint, MapLayerMouseEvent } from "mapbox-gl";
import Map, { Source, Layer, Popup, useMap, MapProvider } from "react-map-gl";
import { Loader } from "@mantine/core";
// local imports
import { getMapSearchInput, calcBoundsFromCoordinates } from "@/utils";
import { ErrorCard, SearchInput } from "@/components";

import { GeoJsonRestaurantProps } from "@/utils/types";
import { Box } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/redux-store/redux-hooks";
import { setGoelocations } from "@/redux-store/geography-slice";

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
  const [locationData, setLocationData] = React.useState({});
  const [flag, setFlag] = React.useState(false);
  const urlParams = router.query.searchParams as string[];
  const [query, setQuery] = React.useState("");
  const mapData = useQuery(
    ["getMapData", query],
    () => getMapSearchInput(query),
    {
      onSuccess(data) {
        setFlag(true);
      },
    }
  );
  React.useEffect(() => {
    if (urlParams) {
      const queryVal = urlParams[0];
      setQuery(queryVal);
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
        const mapBounds = calcBoundsFromCoordinates(restaurantGeoLocations);
        MapA?.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
        setFlag(false);
        setLocationData(restaurantGeoLocations);
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

  return (
    <>
      <SearchInput />
      <MapContainer geolocations={locationData} />
    </>
  );
};

type CameraViewState = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

export const MapContainer: React.FC<{ geolocations: any }> = ({
  geolocations,
}) => {
  // local state
  //const { myMapA } = useMap();
  const mapRef = React.useRef<any>();
  //const [flag, setFlag] = React.useState(false);
  const [cameraViewState, setCameraViewState] =
    React.useState<CameraViewState>();
  const mapGeolocations = useAppSelector((state) => state.geolocation);
  const { dataSourceId, layerId } = mapGeolocations;

  const onViewStateChange = (data: CameraViewState) => {
    setCameraViewState((previousState) => {
      return { ...previousState, ...data };
    });
  };

  const onLoad = () => {
    if (mapRef.current) {
      mapRef.current.loadImage(
        "/marker-icons/red-location-pin.png",
        (error: any, image: any) => {
          if (error)
            return <ErrorCard message="unable to load markers for the map" />;
          mapRef.current.addImage("custom-marker", image);
          const geoJsonSource = mapRef.current.getSource(dataSourceId);
          geoJsonSource.setData(geolocations);
        }
      );
      //programmatically calculate mapZoom and mapBound for initial load of data.
      const mapBounds = calcBoundsFromCoordinates(geolocations);
      mapRef.current.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
    }
  };
  const onMouseEnter = (e: MapLayerMouseEvent) => {
    console.log(" I am running on layer");
    // if (hoverId) {
    //   mapRef.current.setFeatureState(
    //     { source: dataSourceId, id: hoverId },
    //     { hover: false }
    //   );
    // }
    // dispatch(setHoverId(undefined));
    // if (e.features?.length) {
    //   const coordinatesObject = e.features[0].geometry as GeoJSON.Point;
    //   const coordinates = coordinatesObject.coordinates.slice();
    //   const description = e.features[0].properties;
    //   console.log(description, "I am description");
    //   const id = e.features[0].id;
    //   dispatch(setHoverId(id));
    //   mapRef.current.setFeatureState(
    //     { source: dataSourceId, id: id },
    //     { hover: true }
    //   );
    // }
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
      interactiveLayerIds={[layerId]}
      onMouseEnter={onMouseEnter}
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
            "text-offset": [0, 1.2],
            "text-allow-overlap": true,
          }}
          paint={{
            "icon-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              2,
              1,
            ],
          }}
        />
      </Source>
    </Map>
  );
};
