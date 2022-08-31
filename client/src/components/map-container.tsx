import * as React from "react";
import mapboxgl, { CirclePaint } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Text, Box } from "@mantine/core";
import Map, { Source, Layer, Popup, MapLayerMouseEvent } from "react-map-gl";

import { activeMarkerProps } from "./map-layout";
import { LocationPropertiesProps } from "./map-layout";

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_ACCESS}`;

// Mapbox needs a string as data source Id, layerId
const dataSourceId = "some id";
const layerId = "points";

export type MapProps = {
  locationData: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    LocationPropertiesProps
  >;
  openPopup: (data: activeMarkerProps) => void;
  closePopup: () => void;
  showPopup: boolean;
  activePlace: activeMarkerProps;
};

export const MapContainer: React.FC<MapProps> = ({
  locationData,
  openPopup,
  closePopup,
  activePlace,
  showPopup,
}) => {
  const mapRef = React.useRef<any>();

  const [viewState, setViewState] = React.useState({
    latitude: 41.45,
    longitude: -88.53,
    zoom: 7.2,
  });

  // TODO: styling spec should conform to mapbox-layer-styling
  const layerStyle: { id: string; type: string; paint: CirclePaint } = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 5,
      "circle-color": "#007cbf",
    },
  };

  const onMouseEnter = (e: MapLayerMouseEvent) => {
    mapRef.current.on("mouseenter", "points", () => {
      // NOTE: This event does fire but e.features is not defined inside this call callback
    });
    // NOTE: There is a property e.layers which tells you on which map layer this event was triggered
    if (e.features) {
      const coordinatesObject = e.features[0].geometry as GeoJSON.Point;
      const coordinates = coordinatesObject.coordinates.slice();
      const description = e.features[0].properties;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      openPopup({
        ...activePlace,
        latitude: coordinates[1],
        longitude: coordinates[0],
        title: description?.title,
        description: description?.description,
        index: description?.index,
      });
    }
  };

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100%", maxHeight: 600, minHeight: 600, height: 600 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS}
      interactiveLayerIds={[layerId]}
      onMouseEnter={onMouseEnter}
    >
      <Source
        id={dataSourceId}
        type="geojson"
        data={locationData}
        generateId={true}
      >
        <Layer id={layerId} type="circle" paint={layerStyle.paint} />
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
            onClose={() => {
              closePopup();
            }}
          >
            <div
              // This div and transparent backgroubnd is added so that popup remains open on hover
              style={{ border: "10px solid rgba(0, 0, 0, 0)" }}
              onMouseLeave={() => closePopup()}
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
