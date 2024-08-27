import * as React from "react";

export type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

export const getUserLocation = (
  setUserLocation: (val: UserLocation) => void,
  setIsLoading: (val: boolean) => void
  //setError: (val: string) => void
) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setIsLoading(false);
      setUserLocation({ latitude, longitude });
    },
    (error) => {
      console.log("Error get user location: ", error);
      // todo error handling
    }
  );
};
