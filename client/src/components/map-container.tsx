import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { AspectRatio } from "@mantine/core";

const MapContainer: React.FC = () => {
  const mapStyles = {
    height: "100vh",
    width: "100%",
  };

  const defaultCenter = {
    lat: 41.3851,
    lng: 2.1734,
  };

  return (
    <AspectRatio ratio={16 / 9}>
      <LoadScript googleMapsApiKey="YOUR_API_KEY_HERE">
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
        />
      </LoadScript>
    </AspectRatio>
  );
};
export default MapContainer;
