import { PropertiesProps } from "./components/search-mapdisplay";
// TODO: extratc out main function put it here
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

export const fetchStateSearch = async (stateUserInput: string) => {
  const response = await fetch(`/api/dev/${stateUserInput}`, {
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
