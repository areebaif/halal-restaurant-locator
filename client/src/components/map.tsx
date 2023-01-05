import * as React from "react";
import { useQuery } from "react-query";
import mapboxgl, { CirclePaint, MapLayerMouseEvent } from "mapbox-gl";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { Text, Box, HoverCard } from "@mantine/core";
import * as ReactRouter from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux-store/redux-hooks";
import { calcBoundsFromCoordinates } from "../BackendFunc-DataCalc/mapBound-calculations";
import {
  fetchStateSearch,
  fetchStateAndCitySearch,
} from "../BackendFunc-DataCalc/backendFunctions";
import { stringConstants } from "./SearchBar";

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

  // React Router functions
  const location = ReactRouter.useLocation();

  // // query string values
  const queryParams = new URLSearchParams(location.search);
  const state = {
    id: queryParams.get(stringConstants.stateId),
    name: queryParams.get(stringConstants.stateName),
  };
  const city = {
    id: queryParams.get(stringConstants.cityId),
    name: queryParams.get(stringConstants.cityName),
  };
  const zipcode = {
    id: queryParams.get(stringConstants.zipcodeId),
    name: queryParams.get(stringConstants.zipcodeName),
  };
  const restaurant = {
    id: queryParams.get(stringConstants.restaurantId),
    name: queryParams.get(stringConstants.restaurantName),
  };
  // set backend inputs to call backend api
  // if (state?.id) {
  //   const parsedStateId = parseInt(state.id)
  //   dispatch(onStateBackendInputChange({id: parsedStateId, name: state.name}))
  // }

  const zipCodeSearchResult = useQuery(
    ["fetchZipCodeSearch", zipcode.id],
    () => fetchZipSearch(zipcode.id),
    {
      enabled:
        Boolean(zipcode?.id) &&
        Boolean(state?.id) &&
        Boolean(city?.id) &&
        Boolean(!restaurant?.id),
      onSuccess: (data) => {
        console.log("react query zipcode");
        const mapLocations: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> = {
          type: "FeatureCollection",
          features: data?.length ? data : [],
        };
        dispatch(onGoelocationDataChange(mapLocations));
        dispatch(onRefreshMapDataChange(true));
      },
      onError: (error) => {
        //TODO: error handling
        console.log("react query data fetching error", error);
      },
    }
  );

  const stateSearchResult = useQuery(
    ["fetchStateSearch", state.id],
    () => fetchStateSearch(state.id),
    {
      enabled:
        Boolean(state?.id) &&
        Boolean(!city?.id) &&
        Boolean(!zipcode?.id) &&
        Boolean(!restaurant?.id),
      onSuccess: (data) => {
        const mapLocations: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> = {
          type: "FeatureCollection",
          features: data?.length ? data : [],
        };
        dispatch(onGoelocationDataChange(mapLocations));
        dispatch(onRefreshMapDataChange(true));
      },
      onError: (error) => {
        //TODO: error handling
        console.log("react query data fetching error", error);
      },
    }
  );

  const StateCitySearchResult = useQuery(
    ["fetchStateCity", state.id, city.id],
    () => {
      return fetchStateAndCitySearch(state.id, city.id);
    },
    {
      enabled:
        Boolean(state?.id) &&
        Boolean(city?.id) &&
        Boolean(!zipcode?.id) &&
        Boolean(!restaurant?.id),
      // TODO: why is this acting up
      onSuccess: (data) => {
        const mapLocations: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> = {
          type: "FeatureCollection",
          features: data?.length ? data : [],
        };
        dispatch(onGoelocationDataChange(mapLocations));
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
  // TODO: display error message for edge case
  return city.id && !state.id ? (
    <div>
      This is an edge case where user entered city and no state, multiple states
      have cities with same name
    </div>
  ) : (
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
