import { GeoJsonPropertiesRestaurant } from "../types";
const getSWCoordinates = (coordinatesCollection: any) => {
  const lowestLng = Math.min(
    ...coordinatesCollection.map((coordinates: any) => coordinates[0])
  );
  const lowestLat = Math.min(
    ...coordinatesCollection.map((coordinates: any) => coordinates[1])
  );
  // the lowest coordinate on the map is at the lowest zoomed edge of the map which is not visually pleasing
  // artifically adding some latitude degrees to centre coordinates in the map
  const adjustedLowestLat = lowestLat - 0.3;

  return [lowestLng, adjustedLowestLat];
};

const getNECoordinates = (coordinatesCollection: any) => {
  const highestLng = Math.max(
    ...coordinatesCollection.map((coordinates: any) => coordinates[0])
  );
  const highestLat = Math.max(
    ...coordinatesCollection.map((coordinates: any) => coordinates[1])
  );

  // the highest coordinate on the map is at the highest zoomed edge of the map which is not visually pleasing
  // artifically adding some latitude degrees to centre coordinates in the map
  const adjustedHighestLat = highestLat + 0.3;

  return [highestLng, adjustedHighestLat];
};

const calcBoundsFromCoordinates = (
  geolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  >
) => {
  const coordinatesArray = geolocations?.features.map((item) => {
    const coordinatesObj = item.geometry as GeoJSON.Point;
    return coordinatesObj.coordinates;
  });
  const southwestCoordinates = getSWCoordinates(coordinatesArray);
  const northeastCoordinates = getNECoordinates(coordinatesArray);
  const result = [
    southwestCoordinates[0],
    southwestCoordinates[1],
    northeastCoordinates[0],
    northeastCoordinates[1],
  ] as [number, number, number, number];
  return result;
};

export { calcBoundsFromCoordinates };
