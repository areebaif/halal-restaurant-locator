import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl, { MapLayerMouseEvent } from "mapbox-gl";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { Card, Title, Text, Image, Button, px } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
// local imports
import { calcBoundsFromCoordinates } from "@/utils";
import { ErrorCard } from "@/components";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";

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
}) => {
  const router = useRouter();
  const mapRef = React.useRef<any>();
  const [cameraViewState, setCameraViewState] =
    React.useState<CameraViewState>();
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
      const restaurantId = e.features[0].properties?.restaurantId;
      const street = e.features[0].properties?.street;
      const city = e.features[0].properties?.city;
      const state = e.features[0].properties?.state;
      const zip = e.features[0].properties?.zipcode;
      const country = e.features[0].properties?.country;
      const address = `${street}, ${city}, ${state}, ${zip}, ${country}`;
      const coverImageUrl = e.features[0].properties?.coverImageUrl;

      const id = e.features[0].id;
      setHoverId(id);
      mapRef.current.setFeatureState(
        { source: "restaurant locations", id: id },
        { hover: true }
      );
      setPopupData({
        restaurantId,
        restaurantName,
        address,
        description,
        latitude: coordinates[1],
        longitude: coordinates[0],
        coverImageUrl: coverImageUrl,
      });
      setShowPopup(true);
    }
  };

  const onExpandSearchRadius = () => {
    const centreCooridnates = mapRef.current.getCenter() as {
      lat: number;
      lng: number;
    };
    // {lng: -93.24952280000048, lat: 45.052795108312296}
    router.push({
      pathname: "/restaurants",
      query: {
        latitude: `${centreCooridnates.lat.toString()}`,
        longitude: `${centreCooridnates.lng.toString()}`,
      },
    });
  };

  return (
    <div style={{ position: "relative", width: "100%", marginTop: "0.4em" }}>
      <Button
        onClick={onExpandSearchRadius}
        leftIcon={<IconSearch size={16} />}
        size="md"
        variant="outline"
        color="dark"
        styles={(theme) => ({
          root: {
            backgroundColor: theme.colors.gray[0],
          },
        })}
        style={{ position: "absolute", zIndex: 1, top: "1em", right: "1em" }}
      >
        Expand search
      </Button>
      <Map
        id="MapA"
        reuseMaps={true}
        ref={mapRef}
        initialViewState={cameraViewState}
        onMove={(evt) => onViewStateChange(evt.viewState)}
        style={{
          width: "100%",
          //minWidth: "48em",
          maxHeight: 600,
          minHeight: 600,
          height: 600,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS}
        interactiveLayerIds={["points"]}
        onMouseEnter={onMouseEnter}
        onLoad={onLoad}
      >
        <Source id={"restaurant locations"} type="geojson" data={geolocations}>
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
            //closeButton={false}
            longitude={popupData.longitude}
            latitude={popupData.latitude}
            anchor="top"
            onClose={() => {
              mapRef.current.setFeatureState(
                { source: "restaurant locations", id: hoverId },
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
            <Card
              component={Link}
              href={`/restaurants/${popupData.restaurantId}`}
              target="_blank"
              style={{
                marginTop: "-10px",
                marginLeft: "-10px",
                marginRight: "-10px",
                marginBottom: "-10px",
              }}
            >
              <Card.Section>
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/${popupData.coverImageUrl}`}
                  height={120}
                  alt="cover image for restaurant"
                />
              </Card.Section>
              <Title mt="xs" order={5}>
                {popupData.restaurantName}
              </Title>
              <Text size="xs" color="dimmed">
                {`${popupData.address}`}
              </Text>
            </Card>
          </Popup>
        )}
      </Map>
    </div>
  );
};
