import * as React from "react";
import { useQuery } from "react-query";
import mapboxgl from "mapbox-gl";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { Text, Box, HoverCard } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux-store/redux-hooks";
import { calcBoundsFromCoordinates } from "../BackendFunc-DataCalc/mapBound-calculations";

import { fetchZipSearch } from "../BackendFunc-DataCalc/backendFunctions";

import {
  onFetchZipcode,
  onZipCodeBackendInputChange,
} from "../redux-store/search-slice";
import {
  onActiveGeolocationChange,
  onGoelocationDataChange,
  onHoverIdChange,
  onIsOpenActiveGeolocationCardChange,
  onRefreshMapDataChange,
} from "../redux-store/geolocation-slice";
import redMarker from "./red-marker.png";
export interface CameraViewState {
  latitude: number;
  longitude: number;
  zoom?: number;
}

// TODO: programitrcalyy set camera view not set initially
export interface activeGeolocationProps {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  index: number | undefined | string;
}
mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_ACCESS}`;

export const MapBoxMap: React.FC = () => {
  // local state
  const mapRef = React.useRef<any>();
  const [cameraViewState, setCameraViewState] =
    React.useState<CameraViewState>();
  // global imports
  const mapInputs = useAppSelector((state) => state.geolocation);
  const {
    geolocationData,
    activeGeolocation,
    isOpenActiveGeolocationCard,
    refreshMapData,
    hoverId,
    dataSourceId,
    layerId,
  } = mapInputs;

  // ReduxToolkit functions
  const dispatch = useAppDispatch();
  const searchUserInputs = useAppSelector((state) => state.search);

  const {
    zipcodeUserInput,
    stateUserInput,
    cityUserInput,
    restaurantNameUserInput,
    fetchZipcode,
    fetchState,
    fetchStateCity,
    fetchRestaurant,
    fetchRestaurantState,
    fetchRestaurantStateCity,
    fetchRestaurantZipcode,
    zipcodeBackendInput,
    stateBackendInput,
    cityBackendInput,
    restaurantBackendInput,
  } = searchUserInputs;

  React.useEffect(() => {
    if (mapRef.current && refreshMapData) {
      const map = mapRef.current;
      const geoJsonSource = mapRef.current.getSource(dataSourceId);
      geoJsonSource.setData(geolocationData);
      const mapLocations = geolocationData;
      const coordinatesArray = mapLocations?.features.map((item) => {
        const coordinatesObj = item.geometry as GeoJSON.Point;
        return coordinatesObj.coordinates;
      });
      const mapBounds = calcBoundsFromCoordinates(coordinatesArray);
      mapRef.current.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
      //   const lngLatObj = new mapboxgl.LngLatBounds(mapBounds);
      //   const newMapCentre = lngLatObj.getCenter().toArray();
      //   const exisitingMapCentre = map.getCenter().toArray();

      //   if (
      //     exisitingMapCentre[0] === newMapCentre[0] &&
      //     exisitingMapCentre[1] === newMapCentre[1]
      //   ) {
      //     const centre: [number, number] = [newMapCentre[0], newMapCentre[1]];
      //     map.setCenter(centre);
      //   }
      dispatch(onRefreshMapDataChange(false));
    }
  }, [refreshMapData]);

  const onViewStateChange = (data: CameraViewState) => {
    setCameraViewState((previousState) => {
      return { ...previousState, ...data };
    });
  };

  const onLoad = () => {
    if (mapRef.current) {
      mapRef.current.loadImage(redMarker, (error: any, image: any) => {
        // TODO: error handing
        if (error) throw new error("map load error occured");
        mapRef.current.addImage("custom-marker", image);
      });
      // programmatically calculate mapZoom and mapBOund for initial load of data
      const mapLocations = geolocationData;
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
      reuseMaps={true}
      ref={mapRef}
      initialViewState={cameraViewState}
      onMove={(evt) => onViewStateChange(evt.viewState)}
      style={{ width: "100%", maxHeight: 600, minHeight: 600, height: 600 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS}
      interactiveLayerIds={[layerId]}
      //onMouseEnter={onMouseEnter}
      onLoad={onLoad}
    >
      <Source id={dataSourceId} type="geojson" data={geolocationData}>
        <Layer
          id={layerId}
          type="symbol"
          source={dataSourceId}
          layout={{
            "icon-image": "custom-marker",
            "icon-allow-overlap": true,
            "text-field": ["get", "title"],
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
        {isOpenActiveGeolocationCard && (
          <Popup
            longitude={activeGeolocation.longitude}
            offset={-10}
            latitude={activeGeolocation.latitude}
            anchor="top"
            closeButton={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
            }}
          >
            <Box
              onMouseEnter={() => console.log(" I entered")}
              onMouseLeave={() => {
                //onMouseLeavePopup();
              }}
              //onClick={onClick}
              sx={(theme) => ({
                backgroundColor: "white",
                textAlign: "center",
                padding: theme.spacing.xl,
                borderRadius: theme.radius.md,
                cursor: "pointer",
              })}
            >
              test
            </Box>
            {/* <div
            // This div and transparent background is added so that popup remains open on hover
            style={{ border: "10px solid rgba(0, 0, 0, 0.4)" }}
            onMouseLeave={() => {
              onMouseLeavePopup();
            }}
            onClick={onClick}
          >
            <Box
              sx={(theme) => ({
                backgroundColor: "white",
                textAlign: "center",
                padding: theme.spacing.xl,
                borderRadius: theme.radius.md,
                cursor: "pointer",
              })}
            >
              <Text>
                {activePlace.title}: {activePlace.description}
              </Text>
            </Box>
          </div> */}
          </Popup>
        )}
      </Source>
    </Map>
  );
};

export default MapBoxMap;
