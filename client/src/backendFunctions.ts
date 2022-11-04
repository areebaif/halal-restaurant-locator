import { PropertiesProps } from "./components/map-layout";
const zipURL = "/api/dev/zipcode";
export const fetchZipSearch = async (zipcodeUserInput: string) => {
  const response = await fetch(zipURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(zipcodeUserInput),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: {
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry, PropertiesProps>;
  } = await response.json();
  return data.data;
};
