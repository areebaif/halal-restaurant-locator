import { deg2rad } from "./bounding-box";

export const distanceBwTwoCordinatesInMiles = (
  latOne: number,
  lngOne: number,
  latTwo: number,
  lngTwo: number
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(latTwo - latOne);
  const dLng = deg2rad(lngTwo - lngOne);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latOne)) *
      Math.cos(deg2rad(latTwo)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  const distanceInMiles = d * 0.621371;
  return distanceInMiles;
};
