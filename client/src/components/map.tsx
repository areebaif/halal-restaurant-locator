import * as React from "react";
import { useQuery } from "react-query";
import mapboxgl from "mapbox-gl";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { Text, Box, HoverCard } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux-store/redux-hooks";
import {
  onActiveGeolocationChange,
  onGoelocationDataChange,
  onHoverIdChange,
  onIsOpenActiveGeolocationCardChange,
  onRefreshMapDataChange,
  onMapCameraViewChange,
} from "../redux-store/geolocation-slice";
import redMarker from "./red-marker.png";
export interface CameraViewState {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const getSWCoordinates = (coordinatesCollection: any) => {
  const lowestLng = Math.min(
    ...coordinatesCollection.map((coordinates: any) => coordinates[0])
  );
  const lowestLat = Math.min(
    ...coordinatesCollection.map((coordinates: any) => coordinates[1])
  );

  return [lowestLng, lowestLat];
};

const getNECoordinates = (coordinatesCollection: any) => {
  const highestLng = Math.max(
    ...coordinatesCollection.map((coordinates: any) => coordinates[0])
  );
  const highestLat = Math.max(
    ...coordinatesCollection.map((coordinates: any) => coordinates[1])
  );

  return [highestLng, highestLat];
};

const calcBoundsFromCoordinates = (coordinatesCollection: any) => {
  return [
    getSWCoordinates(coordinatesCollection),
    getNECoordinates(coordinatesCollection),
  ];
};

const test = calcBoundsFromCoordinates([
  [8.03287, 46.62789],
  [7.53077, 46.63439],
  [7.57724, 46.63914],
  [7.76408, 46.55193],
  [7.74324, 46.7384],
]);

// returns [[7.53077, 46.55193], [8.03287, 46.7384]]

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
  //   const [cameraViewState, setCameraViewState] =
  //     React.useState<CameraViewState>();
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
    mapCameraView,
  } = mapInputs;

  // ReduxToolkit functions
  const dispatch = useAppDispatch();

  // Test data
  const URL = "/api/dev/data";
  const chicagoLocations = useQuery(
    "getAllLocations",
    async () => {
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: {
        data: GeoJSON.FeatureCollection<GeoJSON.Geometry, any>;
      } = await response.json();
      return data.data;
    },
    {
      onSuccess: (data) => {
        // TODO: fix this that only search term is sent depending on what the search term is
        // TODO: You have to also set camera angle depending on what the user has searched, right now we are hardcoding
        //setCameraViewState({ latitude: 41.45, longitude: -88.53, zoom: 7.2 });
        console.log("I was ran on sucess");
        // do some data manuplulation to only set Chicago Data. There are too many data points

        const filteredValues = data?.features?.filter((item: any) => {
          return item.properties.city === "Chicago";
        });

        const mapLocations: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> = {
          type: "FeatureCollection",
          features: filteredValues?.length ? filteredValues : [],
        };
        const coordinatesArray = mapLocations.features.map((item) => {
          const coordinatesObj = item.geometry as GeoJSON.Point;
          return coordinatesObj.coordinates;
        });
        //console.log(coordinatesArray, "mama");
        const mapBounds = calcBoundsFromCoordinates(coordinatesArray);
        console.log(mapBounds, "lolz!");
        // const coordinatesObject = mapLocations.features[0]
        //   .geometry as GeoJSON.Point;
        // const coordinates = coordinatesObject.coordinates.slice();
        // dispatchMapData to set map values
        dispatch(onGoelocationDataChange(mapLocations));
        //mapRef.current.fitBounds(mapBounds);

        // TODO: I might need to do fitBound and GetBound to programmatically fit all amrkers on map
        // dispatch(
        //   onMapCameraViewChange({
        //     longitude: coordinates[0],
        //     latitude: coordinates[1],
        //     zoom: 9.2,
        //   })
        // );
      },
    }
  );

  if (chicagoLocations.isLoading || !geolocationData) {
    return <span>Loading...</span>;
  }

  if (chicagoLocations.isError) {
    //setZipBackendApiFlag(false);
    return <span>Error: error occured</span>;
  }

  //   const onViewStateChange = (data: CameraViewState) => {
  //     setCameraViewState((previousState) => {
  //       return { ...previousState, ...data };
  //     });
  //   };

  const onLoad = () => {
    console.log(mapRef.current, "lolzz");
    if (mapRef.current) {
      mapRef.current.loadImage(redMarker, (error: any, image: any) => {
        if (error) throw new error("lollz");
        mapRef.current.addImage("custom-marker", image);
      });
      // TODO: this is the value that gives correct zoom of coordinates use this
      // [-87.8209, 41.55315],  [-87.55618, 42.11904]
      // TODO: fix hard coded values, remove cameraViewState from global satte make it local
      mapRef.current.fitBounds(
        new mapboxgl.LngLatBounds([-87.8209, 41.66315], [-87.55618, 42.00904])
      );
    }
  };

  const onIdle = () => {
    console.log(" I was rendered", mapRef.current);
    const layer = mapRef.current.getLayer(layerId);
    console.log(layer, "layer");
  };

  return (
    <Map
      reuseMaps={true}
      ref={mapRef}
      initialViewState={mapCameraView}
      onMove={(evt) => dispatch(onMapCameraViewChange(evt.viewState))}
      style={{ width: "100%", maxHeight: 600, minHeight: 600, height: 600 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS}
      interactiveLayerIds={[layerId]}
      //onMouseEnter={onMouseEnter}
      onLoad={onLoad}
      onIdle={onIdle}
      //onMouseLeave={onMouseLeaveMapLayer}
      //onClick={onClick}
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
