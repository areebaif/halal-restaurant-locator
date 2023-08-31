import * as React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl, { MapLayerMouseEvent } from "mapbox-gl";
import Map, { Source, Layer, Popup } from "react-map-gl";
// local imports
import { calcBoundsFromCoordinates } from "@/utils";
import { ErrorCard } from "@/components";
import { GeoJsonRestaurantProps } from "@/utils/types";
import { Card, Title, Text } from "@mantine/core";

type MapContainerProps = {
  geolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonRestaurantProps
  >;
};

type CameraViewState = {
  latitude: number;
  longitude: number;
  zoom?: number;
};

export const MapContainer: React.FC<MapContainerProps> = ({ geolocations }) => {
  const mapRef = React.useRef<any>();
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
  const [cameraViewState, setCameraViewState] =
    React.useState<CameraViewState>();
  const [showPopup, setShowPopup] = React.useState<boolean>(false);
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
          const geoJsonSource = mapRef.current.getSource(
            "restaurant locations"
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
        { source: "restaurant locations", id: hoverId },
        { hover: false }
      );
    }
    if (e.features?.length) {
      const coordinatesObject = e.features[0].geometry as GeoJSON.Point;
      const coordinates = coordinatesObject.coordinates.slice();
      const description = e.features[0].properties?.description;
      const restaurantName = e.features[0].properties?.restaurantName;
      const street = e.features[0].properties?.street;
      const city = e.features[0].properties?.city;
      const state = e.features[0].properties?.state;
      const zip = e.features[0].properties?.zipcode;
      const country = e.features[0].properties?.country;
      const address = `${street}, ${city}, ${state}, ${zip}, ${country}`;

      const id = e.features[0].id;
      setHoverId(id);
      mapRef.current.setFeatureState(
        { source: "restaurant locations", id: id },
        { hover: true }
      );
      setPopupData({
        restaurantName,
        address,
        description,
        latitude: coordinates[1],
        longitude: coordinates[0],
      });
      setShowPopup(true);
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
      interactiveLayerIds={["points"]}
      onMouseEnter={onMouseEnter}
      onLoad={onLoad}
    >
      <Source
        generateId={true}
        id={"restaurant locations"}
        type="geojson"
        data={geolocations}
      >
        <Layer
          id={"points"}
          type="symbol"
          source={"restaurant locations"}
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
              0.5,
              1,
            ],
          }}
        />
      </Source>
      {/* TODO: do styling */}
      {showPopup && (
        <Popup
          longitude={popupData.longitude}
          latitude={popupData.latitude}
          anchor="top"
          onClose={() => {
            mapRef.current.setFeatureState(
              { source: "restaurant locations", id: hoverId },
              { hover: false }
            );
            setHoverId(undefined);
            setShowPopup(false);
          }}
        >
          <Card shadow="sm" radius="md" withBorder>
            <Title order={4}>{popupData.restaurantName}</Title>
            <Text size="xs" color="dimmed">
              {`${popupData.address}`}
            </Text>
            <Text size="xs" color="dimmed">
              {`${popupData.description}`}
            </Text>
          </Card>
        </Popup>
      )}
    </Map>
  );
};
