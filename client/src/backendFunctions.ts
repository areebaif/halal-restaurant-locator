import { PropertiesProps } from "./components/map-layout";

export const fetchZipSearch = async (zipcodeUserInput: string) => {
  const response = await fetch(`/api/dev/${zipcodeUserInput}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: {
    data: GeoJSON.FeatureCollection<
      GeoJSON.Geometry,
      PropertiesProps
    >["features"];
  } = await response.json();
  return data.data;
};
