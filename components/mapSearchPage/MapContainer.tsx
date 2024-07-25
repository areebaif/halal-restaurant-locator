import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl, { MapLayerMouseEvent } from "mapbox-gl";
import Map, { Source, Layer, Popup } from "react-map-gl";
import { Card, Title, Text, Image, Button, MediaQuery } from "@mantine/core";
// local imports
import {
  calcBoundsFromCoordinates,
  distanceBwTwoCordinatesInMiles,
} from "@/utils";
import { ErrorCard, SearchResultCarousol } from "@/components";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";
import {
  enable_search_button_inMiles_client,
  map_custom_pin_id_client,
  map_id_client,
  map_layerId_client,
  map_source_data_id_client,
} from "@/utils/constants";

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
  const { latitude, longitude } = router.query;
  const mapRef = React.useRef<any>();
  const [cameraViewState, setCameraViewState] =
    React.useState<CameraViewState>();
  const [isEnabledSearchButton, setIsEnabledSearchcButton] =
    React.useState(true);
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

      if (distance > 40) {
        setIsEnabledSearchcButton(true);
      } else {
        setIsEnabledSearchcButton(false);
      }
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

      setHoverId(id);
      mapRef.current.setFeatureState(
        { source: map_source_data_id_client, id: id },
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
      <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
        <Button
          // on xs small devices centre the button
          onClick={onExpandSearchRadius}
          disabled={!isEnabledSearchButton}
          size="xs"
          variant="outline"
          color="dark"
          styles={(theme) => ({
            label: { whiteSpace: "break-spaces", textAlign: "center" },
          })}
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[0],
            position: "absolute",
            zIndex: 1,
            top: "1em",
            right: "1em",
            [theme.fn.smallerThan("sm")]: {
              top: "1em",
              left: "50%",

              transform: "translate(-50%, 0)",
            },
          })}
        >
          Search this area
        </Button>
      </MediaQuery>
      <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
        <Button
          // on xs small devices centre the button
          onClick={onExpandSearchRadius}
          disabled={!isEnabledSearchButton}
          size="sm"
          variant="outline"
          color="dark"
          styles={(theme) => ({
            label: { whiteSpace: "break-spaces", textAlign: "center" },
          })}
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[0],
            position: "absolute",
            zIndex: 1,
            top: "1em",
            right: "1em",
            [theme.fn.smallerThan("sm")]: {
              top: "1em",
              left: "50%",

              transform: "translate(-50%, 0)",
            },
          })}
        >
          Search this area
        </Button>
      </MediaQuery>
      {/* <Box
        sx={(theme) => ({
          position: "absolute",
          zIndex: 1,
          bottom: "0.5em",
          left: "50%",
          transform: "translate(-50%, 0)",
          [theme.fn.largerThan("sm")]: {
            display: "none",
          },
        })}
      >
        <SearchResultCarousol
          geolocations={geolocations}
          hoverId={hoverId}
          setHoverId={setHoverId}
        />
      </Box> */}
      <Map
        id={map_id_client}
        reuseMaps={true}
        ref={mapRef}
        initialViewState={cameraViewState}
        onMove={(evt) => onViewStateChange(evt.viewState)}
        style={{
          width: "100%",
          minHeight: 650,
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
            //closeButton={false}
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
            <Card
              component={Link}
              href={`/restaurants/${popupData.restaurantId}`}
              target="_blank"
              style={{
                marginTop: "-10px",
                marginLeft: "-10px",
                marginRight: "-10px",
                marginBottom: "-15px",
              }}
              shadow="sm"
              radius="0"
              withBorder
            >
              <Card.Section style={{ maxHeight: 120, overflow: "hidden" }}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/${popupData.coverImageUrl}`}
                  alt="picture of a dish in restaurant"
                />
              </Card.Section>

              <Title pt="xs" order={1} size={"h5"}>
                {popupData.restaurantName}
              </Title>
              <Text size="xs" mb="xs" color="dimmed">
                {`${popupData.address}`}
              </Text>
            </Card>
          </Popup>
        )}
      </Map>
    </div>
  );
};
