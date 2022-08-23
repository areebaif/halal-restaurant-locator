import * as React from "react";
import util from "util";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

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

const dataTwo = JSON.stringify(data);
mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_ACCESS}`;

export const MapContainer: React.FC = () => {
  const mapContainer = React.useRef<any>(null);
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = React.useState(-70.9);
  const [lat, setLat] = React.useState(42.35);
  const [zoom, setZoom] = React.useState(9);

  React.useEffect(() => {
    if (mapRef.current) return; // initialize map only once
    const mapObject = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    mapRef.current = mapObject;
    mapObject.on("load", async () => {
      // const loadImagePromise = util.promisify(mapObject.loadImage)
      mapObject.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) throw error;
          if (!image) throw error;
          console.log("I am image", image);

          mapObject.addImage("custom-marker", image);
          // after image loaded add source
          mapObject.addSource("some id", {
            type: "geojson",
            // Documentation: A GeoJSON source. Data must be provided via a "data" property, whose value can be a URL or inline GeoJSON.
            // Adding a variable as data source only works because we have explicity mentioned data source as having interface GeoJSON.FeatureCollection
            // Othereise it tries to reach a URL to add data.
            data: data,
          });
        }
      );
    });

    mapObject.on("idle", () => {
      console.log("idle state");
      // mapObject.isSourceLoaded throws error when the value is false, however the error does not stop the execution of code
      // The error also results in mapObject.on("idle") running twice.
      if (
        mapObject.isSourceLoaded("some id") &&
        !mapObject.getLayer("points")
      ) {
        mapObject.addLayer({
          id: "points",
          type: "symbol",
          source: "some id",
          layout: {
            "icon-image": "custom-marker",
            //get the title name from the source's "title" property
            "text-field": ["get", "title"],
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.25],
            "text-anchor": "top",
          },
        });
      }

      //onsole.log(" I am here", console.log(mapObject.getLayer("points")));
    });
  });
  return (
    <div>
      <div ref={mapContainer} style={{ height: "400px" }} />
    </div>
  );
};
