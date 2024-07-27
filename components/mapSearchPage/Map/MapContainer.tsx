import * as React from "react";
import { useRouter } from "next/router";
import mapboxgl, { MapLayerMouseEvent } from "mapbox-gl";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { Box } from "@mantine/core";
// local imports
import { ErrorCard } from "@/components";
import { SmallScreenPopupCard } from "./SmallScreenPopup";
import { LargeScreenPopup } from "./LargeScreenPopup";
import {
  calcBoundsFromCoordinates,
  distanceBwTwoCordinatesInMiles,
} from "@/utils";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";
import {
  enable_search_button_inMiles_client,
  map_custom_pin_id_client,
  map_id_client,
  map_layerId_client,
  map_source_data_id_client,
} from "@/utils/constants";
import { ResponsiveSearchAreaButton } from "./SearchMapAreaResponsiveButton";
import { SmallScreenToggleMapButton } from "./SmallScreenToggleMapButton";

export type PopupDataProps = {
  restaurantId: string;
  restaurantName: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  coverImageUrl: string;
};

export type MapContainerProps = {
  geolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  >;
  hoverId: string | number | undefined;
  setHoverId: (val: string | number | undefined) => void;
  showPopup: boolean;
  setShowPopup: (val: boolean) => void;
  popupData: PopupDataProps;
  setPopupData: (data: PopupDataProps) => void;
  setToggleSmallScreenMap: (val: boolean) => void;
  toggleSmallScreenMap: boolean;
};

type CameraViewState = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

export const MapContainer: React.FC<MapContainerProps> = ({
  geolocations,
  hoverId,
  setHoverId,
  setPopupData,
  popupData,
  showPopup,
  setShowPopup,
  setToggleSmallScreenMap,
  toggleSmallScreenMap,
}) => {
  const router = useRouter();
  const { latitude, longitude } = router.query;
  const mapRef = React.useRef<any>();

  const [showSmallScreenPopup, setShowSmallScreenPopup] = React.useState(false);
  const [cameraViewState, setCameraViewState] =
    React.useState<CameraViewState>();

  const onViewStateChange = (data: CameraViewState) => {
    setCameraViewState((previousState) => {
      return { ...previousState, ...data };
    });
    if (latitude && longitude) {
      const latString = latitude as string;
      const lngString = longitude as string;
      const newCenter = [data.longitude, data.latitude];
      const distance = distanceBwTwoCordinatesInMiles(
        newCenter[1],
        newCenter[0],
        parseFloat(latString),
        parseFloat(lngString)
      );
    }
  };

  const onLoad = () => {
    if (mapRef.current) {
      mapRef.current.loadImage(
        "/marker-icons/red-location-pin.png",
        (error: any, image: any) => {
          if (error)
            return <ErrorCard message="unable to load markers for the map" />;
          mapRef.current.addImage(map_custom_pin_id_client, image);
          const geoJsonSource = mapRef.current.getSource(
            map_source_data_id_client
          );
          geoJsonSource.setData(geolocations);
        }
      );
      //programmatically calculate mapZoom and mapBound for initial load of data.
      if (geolocations.features.length) {
        const mapBounds = calcBoundsFromCoordinates(geolocations);
        mapRef.current.fitBounds(new mapboxgl.LngLatBounds(mapBounds));
      }
    }
  };
  const onMouseEnter = (e: MapLayerMouseEvent) => {
    if (hoverId) {
      mapRef.current.setFeatureState(
        { source: map_source_data_id_client, id: hoverId },
        { hover: false }
      );
    }
    if (e.features?.length) {
      const coordinatesObject = e.features[0].geometry as GeoJSON.Point;
      const coordinates = coordinatesObject.coordinates.slice();
      const description = e.features[0].properties?.description;
      const restaurantName = e.features[0].properties?.restaurantName;
      const restaurantId = e.features[0].properties?.restaurantId;
      const street = e.features[0].properties?.street;
      const city = e.features[0].properties?.city;
      const state = e.features[0].properties?.state;
      const zip = e.features[0].properties?.zipcode;
      const country = e.features[0].properties?.country;
      const address = `${street}, ${city}, ${state}, ${zip}, ${country}`;
      const coverImageUrl = e.features[0].properties?.coverImageUrl;
      const id = e.features[0].id;

      setPopupData({
        restaurantId,
        restaurantName,
        address,
        description,
        latitude: coordinates[1],
        longitude: coordinates[0],
        coverImageUrl: coverImageUrl,
      });
      console.log(window, window.innerWidth, "s;lsls;ls;ls");
      // if screenwidth is smaller than md dont show popup
      if (window.innerWidth >= 1024) {
        setShowPopup(true);
        setHoverId(id);
        mapRef.current.setFeatureState(
          { source: map_source_data_id_client, id: id },
          { hover: true }
        );
      } else {
        setShowSmallScreenPopup(true);
      }
    }
  };
  // TODO: fix this to search in visible area
  const onExpandSearchRadius = () => {
    const centreCooridnates = mapRef.current.getCenter() as {
      lat: number;
      lng: number;
    };

    router.push({
      pathname: "/restaurants",
      query: {
        latitude: `${centreCooridnates.lat.toString()}`,
        longitude: `${centreCooridnates.lng.toString()}`,
      },
    });
  };

  const smallScreenPopupProps = {
    popupData,
    setPopupData,
    setShowSmallScreenPopup,
  };
  const largeScreenPopupProps = {
    popupData,
    setPopupData,
    setShowPopup,
    hoverId,
    setHoverId,
  };
  const ResponsiveSearchAReaButtonProps = {
    onExpandSearchRadius,
  };
  const smallScreenToggleMapButton = {
    setToggleSmallScreenMap,
    toggleSmallScreenMap,
  };
  return (
    <Box style={{ position: "relative", width: "100%", marginTop: "0.4em" }}>
      <ResponsiveSearchAreaButton {...ResponsiveSearchAReaButtonProps} />
      <Box
        sx={(theme) => ({
          position: "absolute",
          zIndex: 1,
          bottom: "0.5em",
          left: "50%",
          transform: "translate(-50%, 0)",
        })}
      >
        <SmallScreenToggleMapButton {...smallScreenToggleMapButton} />
      </Box>

      {showSmallScreenPopup && (
        <Box
          sx={(theme) => ({
            position: "absolute",
            zIndex: 1,
            bottom: "0.5em",
            left: "50%",
            maxWidth: 350,
            transform: "translate(-50%, 0)",
            [theme.fn.largerThan("md")]: {
              display: "none",
            },
          })}
        >
          <SmallScreenPopupCard {...smallScreenPopupProps} />{" "}
        </Box>
      )}
      <Map
        id={map_id_client}
        reuseMaps={true}
        ref={mapRef}
        initialViewState={cameraViewState}
        onMove={(evt) => onViewStateChange(evt.viewState)}
        style={{
          width: "100%",
          minHeight: 500,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS}
        interactiveLayerIds={[map_layerId_client]}
        onMouseEnter={onMouseEnter}
        onLoad={onLoad}
      >
        <Source
          id={map_source_data_id_client}
          type="geojson"
          data={geolocations}
        >
          <Layer
            id={map_layerId_client}
            type="symbol"
            source={map_source_data_id_client}
            layout={{
              "icon-image": map_custom_pin_id_client,
              "icon-allow-overlap": true,
              "text-field": ["get", "restaurantName"],
              "text-offset": [0, 1.2],
              "text-allow-overlap": true,
            }}
            paint={{
              "icon-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.5,
                1,
              ],
            }}
          />
        </Source>
        {/* TODO: do styling */}
        {showPopup && (
          <Popup
            closeButton={false}
            longitude={popupData.longitude}
            latitude={popupData.latitude}
            //anchor="top"
            onClose={() => {
              mapRef.current.setFeatureState(
                { source: map_source_data_id_client, id: hoverId },
                { hover: false }
              );
              setPopupData({
                restaurantId: "",
                restaurantName: "",
                description: "",
                address: "",
                latitude: 0,
                longitude: 0,
                coverImageUrl: "",
              });
              setHoverId(undefined);
              setShowPopup(false);
            }}
          >
            <LargeScreenPopup {...largeScreenPopupProps} />
          </Popup>
        )}
      </Map>
    </Box>
  );
};
