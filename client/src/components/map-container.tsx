import * as React from "react";
import mapboxgl, { CirclePaint } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import Map, {
  Marker,
  Source,
  Layer,
  Popup,
  useMap,
  MapLayerMouseEvent,
} from "react-map-gl";

// We have to explicitly type defination the data source otherwise mapObject.addSource tries to reach out URL by default and throws error
const data: GeoJSON.FeatureCollection = {
  features: [
    {
      type: "Feature",
      properties: {
        title: "Lincoln Park",
        description: "A northside park that is home to the Lincoln Park Zoo",
      },
      geometry: {
        coordinates: [-87.637596, 41.940403],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Burnham Park",
        description: "A lakefront park on Chicago's south side",
      },
      geometry: {
        coordinates: [-87.603735, 41.829985],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Millennium Park",
        description:
          "A downtown park known for its art installations and unique architecture",
      },
      geometry: {
        coordinates: [-87.622554, 41.882534],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Grant Park",
        description:
          "A downtown park that is the site of many of Chicago's favorite festivals and events",
      },
      geometry: {
        coordinates: [-87.619185, 41.876367],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Humboldt Park",
        description: "A large park on Chicago's northwest side",
      },
      geometry: {
        coordinates: [-87.70199, 41.905423],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Douglas Park",
        description:
          "A large park near in Chicago's North Lawndale neighborhood",
      },
      geometry: {
        coordinates: [-87.699329, 41.860092],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Calumet Park",
        description:
          "A park on the Illinois-Indiana border featuring a historic fieldhouse",
      },
      geometry: {
        coordinates: [-87.530221, 41.715515],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Jackson Park",
        description:
          "A lakeside park that was the site of the 1893 World's Fair",
      },
      geometry: {
        coordinates: [-87.580389, 41.783185],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Columbus Park",
        description: "A large park in Chicago's Austin neighborhood",
      },
      geometry: {
        coordinates: [-87.769775, 41.873683],
        type: "Point",
      },
    },
  ],
  type: "FeatureCollection",
};
mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_ACCESS}`;

// Mapbox needs a string as data source Id, layerId
const dataSourceId = "some id";
const layerId = "points";

// export const PopupComponent: React.FC<{
//   latitude: number;
//   longitude: number;
// }> = ({ latitude, longitude }) => {
//   const [showPopup, setShowPopup] = React.useState(false);
//   const [lat, setLat] = React.useState<number>(latitude);
//   const [lng, setLng] = React.useState(longitude);

//   return <Popup longitude={lng} latitude={lat}></Popup>;
// };

export const MapContainer: React.FC = () => {
  const mapRef = React.useRef<any>();
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupLat, setPopupLat] = React.useState(0);
  const [popupLng, setPopupLng] = React.useState(0);
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
    console.log("hello", e);
    mapRef.current.on("mouseenter", "points", () => {
      console.log("I am in");
    });
    if (e.features) {
      console.log("e", e.features[0].geometry);
      const coordinatesObject = e.features[0].geometry as GeoJSON.Point;
      const coordinates = coordinatesObject.coordinates.slice();
      const description = e.features[0].properties;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      // TODO: coordinates value will be where you show popup
      setPopupLat(coordinates[1]);
      setPopupLng(coordinates[0]);
      setShowPopup(true);
      console.log(popupLng, popupLat, coordinates);
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
      <Source id={dataSourceId} type="geojson" data={data}>
        <Layer id={layerId} type="circle" paint={layerStyle.paint} />
        {showPopup && (
          <Popup
            longitude={popupLng}
            latitude={popupLat}
            anchor="top"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              border: "1px solid black",
              backgroundColor: "white",
            }}
            onClose={() => {
              setShowPopup(false);
            }}
          >
            <div>You are here</div>
          </Popup>
        )}
      </Source>
    </Map>
  );
};
