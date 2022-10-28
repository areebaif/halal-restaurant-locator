import * as React from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Text, Box } from "@mantine/core";
import Map, { Source, Layer, Popup, MapLayerMouseEvent } from "react-map-gl";

import redMarker from "./red-marker.png";
import { activeMarkerProps, PropertiesProps } from "./map-layout";

// We need this varibale to sync map id data with react and its local to this file

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_ACCESS}`;
let hoverId: string | undefined | number = undefined;

export type MapProps = {
  // props to render map
  dataSource: GeoJSON.FeatureCollection<GeoJSON.Geometry, PropertiesProps>;
  dataSourceId: string;
  mapRef?: any;
  layerId: string;

  // props related to active location on map
  activePlace: activeMarkerProps;
  setActivePlaceData?: (data: activeMarkerProps | null) => void;

  // props related to detail data of active location on map
  locationInfoCard?: boolean;
  onLocationInfoOpenCard?: (data: activeMarkerProps) => void;
  onLocationInfoCloseCard?: () => void;
  locationInfoCardData?: activeMarkerProps;

  // Data for when user triggers search
  onSearch?: (
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry, PropertiesProps>
  ) => void;
};

export const MapContainer: React.FC<MapProps> = ({
  dataSource,
  activePlace,
  mapRef,
  dataSourceId,
  layerId,
  onLocationInfoOpenCard,
  setActivePlaceData,
}) => {
  const [displayPopup, setDisplayPopup] = React.useState(false);
  const [viewState, setViewState] = React.useState({
    latitude: 41.45,
    longitude: -88.53,
    zoom: 7.2,
  });
  // Style layer for circle marker
  // const layerStyle: { id: string; type: string; paint: CirclePaint } = {
  //   id: "point",
  //   type: "circle",
  //   paint: {
  //     "circle-radius": [
  //       "case",
  //       ["boolean", ["feature-state", "hover"], false],
  //       10,
  //       5,
  //     ],
  //     "circle-color": "#007cbf",
  //   },
  // };

  const onMouseEnter = (e: MapLayerMouseEvent) => {
    if (hoverId) {
      mapRef.current.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
    }
    hoverId = undefined;
    if (e.features?.length) {
      const coordinatesObject = e.features[0].geometry as GeoJSON.Point;
      const coordinates = coordinatesObject.coordinates.slice();
      const description = e.features[0].properties;
      hoverId = e.features[0].id;

      // ***** NOTE: not sure if we want to keep this *****
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      // }
      setActivePlaceData?.({
        ...activePlace,
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
        title: description?.title,
        description: description?.description,
        index: description?.index,
      });
      setDisplayPopup(true);

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
    if (
      typeof activePlace.index === "number" ||
      typeof activePlace.index === "string"
    ) {
      onLocationInfoOpenCard?.(activePlace);
    }

    // SetData in react hook
    // onSearch?.(testData);
    // const geoJsonSource = mapRef.current.getSource(dataSourceId);
    // // setData on mapsource: It does not update even if you tell react to update, we have to use map inbuilt methods to update mapdata to limit map renders, inistialising  for billing
    // geoJsonSource.setData(testData);
  };

  const onMouseLeavePopup = () => {
    // disable hover interactivity inside layer of map
    mapRef.current.setFeatureState(
      { source: dataSourceId, id: hoverId },
      { hover: false }
    );
    hoverId = undefined;

    setDisplayPopup(false);
    setActivePlaceData?.(null);
  };

  const onLoad = () => {
    mapRef.current.loadImage(redMarker, (error: any, image: any) => {
      if (error) throw error;
      mapRef.current.addImage("custom-marker", image);
    });
  };

  const onMouseLeaveMapLayer = () => {
    // hoverId === 0 results in a falsy statement, hence, checking for type
    if (
      (typeof hoverId === "number" || typeof hoverId === "string") &&
      !displayPopup
    ) {
      mapRef.current.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
      hoverId = undefined;
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
      onMouseLeave={onMouseLeaveMapLayer}
      onClick={onClick}
    >
      <Source id={dataSourceId} type="geojson" data={dataSource}>
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
        {displayPopup && (
          <Popup
            longitude={activePlace.longitude}
            offset={-20}
            latitude={activePlace.latitude}
            anchor="top"
            closeButton={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
            }}
          >
            <div
              // This div and transparent background is added so that popup remains open on hover
              style={{ border: "10px solid rgba(0, 0, 0, 0)" }}
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
            </div>
          </Popup>
        )}
      </Source>
    </Map>
  );
};
