import * as React from "react";
import { useQuery } from "react-query";
import mapboxgl, { CirclePaint, MapLayerMouseEvent } from "mapbox-gl";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { Text, Box, HoverCard } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux-store/redux-hooks";
import { calcBoundsFromCoordinates } from "../BackendFunc-DataCalc/mapBound-calculations";
import {
  fetchStateSearch,
  fetchStateAndCitySearch,
} from "../BackendFunc-DataCalc/backendFunctions";

import {
  onCityBackendInputChange,
  onRestaurantdeBackendInputChange,
  onStateBackendInputChange,
  onZipCodeBackendInputChange,
  onFetchRestaurant,
  onFetchRestaurantState,
  onFetchRestaurantStateCity,
  onFetchRestaurantZipcode,
  onFetchState,
  onFetchStateCity,
  onFetchZipcode,
} from "../redux-store/search-slice";

import {
  onActiveGeolocationChange,
  onGoelocationDataChange,
  onHoverIdChange,
  onIsOpenActiveGeolocationCardChange,
  onRefreshMapDataChange,
} from "../redux-store/geolocation-slice";

import { fetchZipSearch } from "../BackendFunc-DataCalc/backendFunctions";

export interface CameraViewState {
  latitude: number;
  longitude: number;
  zoom?: number;
}

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

  const searchUserInputs = useAppSelector((state) => state.search);
  const {
    //zipcodeUserInput,
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
  // TODO: depending on the route we hit, dispatch state change which will load components
  // you need local isLoading state that does not display map until loading has complete orglobal satte lets see what reduces mapload

  // const zipCodeSearchResult = useQuery(
  //   ["fetchZipCodeSearch", zipcodeUserInput],
  //   () => fetchZipSearch(zipcodeUserInput),
  //   {
  //     enabled: false || fetchZipcode,
  //     onSuccess: (data) => {
  //       console.log(data, "I just ran");
  //       const mapLocations: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> = {
  //         type: "FeatureCollection",
  //         features: data?.length ? data : [],
  //       };
  //       dispatch(onGoelocationDataChange(mapLocations));
  //       dispatch(onFetchZipcode(false));
  //       dispatch(
  //         onZipCodeBackendInputChange({ id: undefined, name: undefined })
  //       );
  //       dispatch(onRefreshMapDataChange(true));
  //     },
  //     onError: (error) => {
  //       //TODO: error handling
  //       console.log("react query data fetching error", error);
  //     },
  //   }
  // );

  const stateSearchResult = useQuery(
    ["fetchStateSearch", stateBackendInput.id],
    () => fetchStateSearch(stateBackendInput.id!),
    {
      enabled: false || fetchState,
      onSuccess: (data) => {
        // TODO: set Map data
        const mapLocations: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> = {
          type: "FeatureCollection",
          features: data?.length ? data : [],
        };
        dispatch(onGoelocationDataChange(mapLocations));
        dispatch(onFetchState(false));
        dispatch(onStateBackendInputChange({ id: undefined, name: undefined }));
        dispatch(onRefreshMapDataChange(true));
      },
      onError: (error) => {
        //TODO: error handling
        console.log("react query data fetching error", error);
      },
    }
  );

  const StateCitySearchResult = useQuery(
    ["fetchStateCity", stateBackendInput.id, cityBackendInput.id],
    () => fetchStateAndCitySearch(stateBackendInput.id!, cityBackendInput.id!),
    {
      enabled: false || fetchStateCity,
      onSuccess: (data) => {
        // TODO: onGeolocatiobnDatachange
        const mapLocations: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> = {
          type: "FeatureCollection",
          features: data?.length ? data : [],
        };
        dispatch(onGoelocationDataChange(mapLocations));
        dispatch(onFetchStateCity(false));
        dispatch(onStateBackendInputChange({ id: undefined, name: undefined }));
        dispatch(onCityBackendInputChange({ id: undefined, name: undefined }));
        dispatch(onRefreshMapDataChange(true));
      },
      onError: (error) => {
        //TODO: error handling
        console.log("react query data fetching error", error);
      },
    }
  );

  React.useEffect(() => {
    if (mapRef.current) {
      if (mapRef.current.getSource(dataSourceId)) {
        const geoJsonSource = mapRef.current.getSource(dataSourceId);
        geoJsonSource.setData(geolocationData);
        const mapLocations = geolocationData;
        const coordinatesArray = mapLocations?.features.map((item) => {
          const coordinatesObj = item.geometry as GeoJSON.Point;
          return coordinatesObj.coordinates;
        });
        const mapBounds = calcBoundsFromCoordinates(coordinatesArray);
        mapRef.current.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
      }
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
      mapRef.current.loadImage(
        "/marker-icons/mapbox-marker-icon-20px-red.png",
        (error: any, image: any) => {
          // TODO: error handing
          if (error) throw new error("map load error occured");
          mapRef.current.addImage("custom-marker", image);
        }
      );
      // programmatically calculate mapZoom and mapBound for initial load of data.
      const mapLocations = geolocationData;
      const coordinatesArray = mapLocations?.features.map((item) => {
        const coordinatesObj = item.geometry as GeoJSON.Point;
        return coordinatesObj.coordinates;
      });
      const mapBounds = calcBoundsFromCoordinates(coordinatesArray);
      mapRef.current.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
    }
  };

  //   const onMouseEnter = (e: MapLayerMouseEvent) => {
  //     if (hoverId) {
  //       mapRef.current.setFeatureState(
  //         { source: dataSourceId, id: hoverId },
  //         { hover: false }
  //       );
  //     }
  //     dispatch(onHoverIdChange(undefined))
  //     if (e.features?.length) {
  //         const coordinatesObject = e.features[0].geometry as GeoJSON.Point;
  //         const coordinates = coordinatesObject.coordinates.slice();
  //         const description = e.features[0].properties;
  //         const id = e.features[0].id
  //     dispatch(onHoverIdChange(e.features[0].id))
  //     }

  // }

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
            offset={25}
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
