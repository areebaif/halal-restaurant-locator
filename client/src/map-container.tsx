import React from "react";
import { Loader, AspectRatio } from "@mantine/core";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "500px",
  height: "500px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const locations = [
  {
    id: 1,
    name: "Location 1",
    location: {
      lat: 41.3954,
      lng: 2.162,
    },
  },
  {
    id: 2,
    name: "Location 2",
    location: {
      lat: 41.3917,
      lng: 2.1649,
    },
  },
  {
    id: 3,
    name: "Location 3",
    location: {
      lat: 41.3773,
      lng: 2.1585,
    },
  },
  {
    id: 4,
    name: "Location 4",
    location: {
      lat: 41.3797,
      lng: 2.1682,
    },
  },
  {
    id: 5,
    name: "Location 5",
    location: {
      lat: 41.4055,
      lng: 2.1915,
    },
  },
];

const MapContainer = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "YOUR_API_KEY",
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  // TODO: dont know the typing of locations object array recieved from backend
  const [activeMarker, setActiveMarker] = React.useState<any>(null);

  const onSelect = (marker: any) => {
    if (marker.id === activeMarker.id) {
      return;
    }
    setActiveMarker(marker);
  };

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);
  // TODO: error handling
  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? (
    <AspectRatio ratio={16 / 9}>
      <GoogleMap
        center={center}
        zoom={10}
        onLoad={onLoad}
        onClick={() => setActiveMarker(null)}
        onUnmount={onUnmount}
      >
        {locations.map((item) => {
          return (
            <Marker
              key={item.id}
              position={item.location}
              onClick={() => onSelect(item)}
            />
          );
        })}
        {activeMarker?.location && (
          <InfoWindow
            position={activeMarker?.location}
            onCloseClick={() => setActiveMarker(null)}
          >
            <p>{activeMarker?.name}</p>
          </InfoWindow>
        )}
      </GoogleMap>
    </AspectRatio>
  ) : (
    <Loader />
  );
};

export default React.memo(MapContainer);
