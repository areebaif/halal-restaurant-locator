import * as React from "react";
import mapboxgl, { CirclePaint } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Text, Box } from "@mantine/core";
import Map, { Source, Layer, Popup, MapLayerMouseEvent } from "react-map-gl";
import redMarker from "./red-marker.png";

import { activeMarkerProps } from "./map-layout";
import { LocationPropertiesProps } from "./map-layout";
import { hover } from "@testing-library/user-event/dist/hover";

// const testData: GeoJSON.FeatureCollection<
//   GeoJSON.Geometry,
//   LocationPropertiesProps
// > = {
//   features: [
//     {
//       type: "Feature",
//       properties: {
//         title: "Lincoln Park",
//         description: "A northside park that is home to the Lincoln Park Zoo",
//         index: 0,
//       },
//       geometry: {
//         coordinates: [-87.637596, 41.940403],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "Burnham Park",
//         description: "A lakefront park on Chicago's south side",
//         index: 1,
//       },
//       geometry: {
//         coordinates: [-87.603735, 41.829985],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "Millennium Park",
//         description:
//           "A downtown park known for its art installations and unique architecture",
//         index: 2,
//       },
//       geometry: {
//         coordinates: [-87.622554, 41.882534],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "Grant Park",
//         description:
//           "A downtown park that is the site of many of Chicago's favorite festivals and events",
//         index: 3,
//       },
//       geometry: {
//         coordinates: [-87.619185, 41.876367],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "Humboldt Park",
//         description: "A large park on Chicago's northwest side",
//         index: 4,
//       },
//       geometry: {
//         coordinates: [-87.70199, 41.905423],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "Douglas Park",
//         description:
//           "A large park near in Chicago's North Lawndale neighborhood",
//         index: 5,
//       },
//       geometry: {
//         coordinates: [-87.699329, 41.860092],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "Calumet Park",
//         description:
//           "A park on the Illinois-Indiana border featuring a historic fieldhouse",
//         index: 6,
//       },
//       geometry: {
//         coordinates: [-87.530221, 41.715515],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "Jackson Park",
//         description:
//           "A lakeside park that was the site of the 1893 World's Fair",
//         index: 7,
//       },
//       geometry: {
//         coordinates: [-87.580389, 41.783185],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "Columbus Park",
//         description: "A large park in Chicago's Austin neighborhood",
//         index: 8,
//       },
//       geometry: {
//         coordinates: [-87.769775, 41.873683],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "Limit doneness lolss",
//         description: "Test coordinate",
//         index: 9,
//       },
//       geometry: {
//         coordinates: [-0.12894, 51.52167],
//         type: "Point",
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         title: "France lochness",
//         description: "Test coordinate",
//         index: 10,
//       },
//       geometry: {
//         coordinates: [2.17967, 46.58635],
//         type: "Point",
//       },
//     },
//   ],
//   type: "FeatureCollection",
// };

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
      console.log("I was triggered", e.lngLat);
      const coordinatesObject = e.features[0].geometry as GeoJSON.Point;
      const coordinates = coordinatesObject.coordinates.slice();
      const description = e.features[0].properties;
      const index: number = description?.index;
      //console.log(" I am e", coordinatesObject, e.lngLat);

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

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
  const onClick = () => {
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
    if (hoverId && !showPopup) {
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
      onMouseMove={onMouseEnter}
      onLoad={onLoad}
      onMouseLeave={onMouseExit}
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
            offset={-10}
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
