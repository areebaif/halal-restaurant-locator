export const boundingBoxCalc = (
  latitude: number,
  longitude: number,
  distanceInMiles: number
) => {
  const latLimits = [deg2rad(-90), deg2rad(90)];
  const lngLimits = [deg2rad(-180), deg2rad(180)];

  const radLat = deg2rad(latitude);
  const radLng = deg2rad(longitude);

  if (
    radLat < latLimits[0] ||
    radLat > latLimits[1] ||
    radLng < lngLimits[0] ||
    radLng > lngLimits[1]
  ) {
    throw new Error("invalid arguments");
  }

  // Angular distance in radians on a great circle,
  // using Earth's radius in miles.
  const angular = distanceInMiles / 3958.762079;
  let minLat = radLat - angular;
  let maxLat = radLat + angular;
  let minLng: number = 0;
  let maxLng: number = 0;

  if (minLat > latLimits[0] && maxLat < latLimits[1]) {
    const deltaLng = Math.asin(Math.sin(angular) / Math.cos(radLat));
    minLng = radLng - deltaLng;

    if (minLng < lngLimits[0]) {
      minLng += 2 * Math.PI;
    }

    maxLng = radLng + deltaLng;

    if (maxLng > lngLimits[1]) {
      maxLng -= 2 * Math.PI;
    }
  } else {
    // A pole is contained within the distance.
    minLat = Math.max(minLat, latLimits[0]);
    maxLat = Math.min(maxLat, latLimits[1]);
    minLng = lngLimits[0];
    maxLng = lngLimits[1];
  }

  return [rad2deg(minLat), rad2deg(minLng), rad2deg(maxLat), rad2deg(maxLng)];
};

const deg2rad = (degrees: number) => {
  const pi = Math.PI;
  return degrees * (pi / 180);
};

const rad2deg = (radians: number) => {
  const pi = Math.PI;
  return radians * (180 / pi);
};
