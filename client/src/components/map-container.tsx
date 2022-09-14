import * as React from "react";
import mapboxgl, { CirclePaint } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Text, Box } from "@mantine/core";
import Map, { Source, Layer, Popup, MapLayerMouseEvent } from "react-map-gl";

import redMarker from "./red-marker.png";
import { activeMarkerProps } from "./map-layout";
import { LocationPropertiesProps } from "./map-layout";

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_ACCESS}`;

let hoverId: null | number = null;

export type MapProps = {
  locationData: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    LocationPropertiesProps
  >;
  openPopup: (data: activeMarkerProps) => void;
  closePopup: () => void;
  showPopup?: boolean;
  activePlace: activeMarkerProps;
  showCard?: boolean;
  openCard?: () => void;
  closeCard?: () => void;
  mapRef?: any;
  dataSourceId: string;
  layerId: string;
  onSearch?: (
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry, LocationPropertiesProps>
  ) => void;
};

export const MapContainer: React.FC<MapProps> = ({
  locationData,
  openPopup,
  closePopup,
  activePlace,
  showPopup,
  mapRef,
  dataSourceId,
  layerId,
  onSearch,
  openCard,
  closeCard,
  showCard,
}) => {
  const [viewState, setViewState] = React.useState({
    latitude: 41.45,
    longitude: -88.53,
    zoom: 7.2,
  });

  // TODO: styling spec should conform to mapbox-layer-styling: We are handling the case in which user hovers over a marker
  const layerStyle: { id: string; type: string; paint: CirclePaint } = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        10,
        5,
      ],
      "circle-color": "#007cbf",
    },
  };
  // const layerStyle = {
  //   //id: "point",
  //   //type: "symbol",
  //   layout: {
  //     "icon-image": "marker",
  //     "text-field": ["get", "title"],
  //   },
  // };

  const onMouseEnter = (e: MapLayerMouseEvent) => {
    if (hoverId) {
      mapRef.current.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
    }
    hoverId = null;
    if (e.features?.length) {
      const coordinatesObject = e.features[0].geometry as GeoJSON.Point;
      const coordinates = coordinatesObject.coordinates.slice();
      const description = e.features[0].properties;
      const index: number = description?.index;
      //console.log(" I am e", coordinatesObject, e.lngLat);

      // ***** NOTE: not sure if we want to keep this *****
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      // }

      hoverId = index;

      openPopup({
        ...activePlace,
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
        title: description?.title,
        description: description?.description,
        index: description?.index,
      });

      // setting up hover interactivity inside layer of map:
      mapRef.current.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: true }
      );
    }
  };
  // TODO: searching and filtering will update result instead of onclick handler
  // Right now this works with onClick
  const onClick = (e: any) => {
    if (showPopup) {
      console.log("hello card showed");
    }

    // SetData in react hook
    // onSearch?.(testData);
    // const geoJsonSource = mapRef.current.getSource(dataSourceId);
    // //console.log(" geojson soiurce", geoJsonSource);
    // // setData on mapsource: It does not update even if you tell react to update, we have to use map inbuilt methods to update mapdata to limit map renders, inistialising  for billing
    // geoJsonSource.setData(testData);
  };

  const onMouseLeave = () => {
    // disable hover interactivity inside layer of map
    mapRef.current.setFeatureState(
      { source: dataSourceId, id: hoverId },
      { hover: false }
    );
    hoverId = null;
    // close Popup
    closePopup();
  };

  const onLoad = () => {
    mapRef.current.loadImage(redMarker, (error: any, image: any) => {
      if (error) throw error;
      mapRef.current.addImage("custom-marker", image);
    });
  };

  const onMouseExit = () => {
    // hoverId === 0 results in a falsy statement, hence, checking for type
    if (typeof hoverId === "number" && !showPopup) {
      mapRef.current.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
      hoverId = null;
    }
  };

  return (
    <Map
      reuseMaps={true}
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", maxHeight: 600, minHeight: 600, height: 600 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS}
      interactiveLayerIds={[layerId]}
      onMouseEnter={onMouseEnter}
      onLoad={onLoad}
      onMouseLeave={onMouseExit}
      onClick={onClick}
    >
      <Source
        id={dataSourceId}
        type="geojson"
        data={locationData}
        generateId={true}
      >
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
              2,
              1,
            ],
          }}
        />
        {showPopup && (
          <Popup
            longitude={activePlace.longitude}
            offset={-5}
            latitude={activePlace.latitude}
            anchor="top"
            closeButton={false}
            closeOnClick={true}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
            }}
          >
            <div
              // This div and transparent backgroubnd is added so that popup remains open on hover
              style={{ border: "10px solid rgba(0, 0, 0, 0)" }}
              onMouseLeave={() => {
                onMouseLeave();
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
            </div>
          </Popup>
        )}
      </Source>
    </Map>
  );
};
