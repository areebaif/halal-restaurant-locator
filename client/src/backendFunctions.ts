import { PropertiesProps } from "./components/search-map-display";
// TODO: extratc out main function put it here

export interface restaurantDocument {
  id: BigInteger;
  name: string;
  state: string;
  city: string;
  country: string;
  zipcode: string;
  longitude: number;
  latitude: number;
  // geolocation: [longitude,latitude]
  geolocation: [number, number];
}

export interface cityDocument {
  id: number;
  name: string;
}

export interface stateDocument {
  id: number;
  name: string;
}
export interface ZipDocument {
  city_state: string;
  type: "Feature";
  properties: {
    title: string;
    city: string;
    state_id: string;
    state: string;
    zip: string;
  };
  id: number;
  geometry: {
    coordinates: [number, number];
    type: "Point";
  };
}

export const fetchZipSearch = async (zipcodeUserInput: string | undefined) => {
  if (!zipcodeUserInput) throw new Error("provide zipcode value");
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

export const fetchStateAndCitySearch = async (
  stateUserInput: string,
  cityUserInput: string
) => {
  const response = await fetch(`/api/dev/${stateUserInput}/${cityUserInput}`, {
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

export const fetchRestaurantNameSearch = async (name: string) => {
  const response = await fetch(`/api/dev/${name}`, {
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

export interface FetchAutomplete {
  citySet: cityDocument[];
  stateSet: stateDocument[];
  zipSet: ZipDocument[];
  restaurantSet: restaurantDocument[];
}

export const fetchAutoCompleteData = async () => {
  const response = await fetch("/api/dev/getGeography");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const responseData: {
    data: FetchAutomplete;
  } = await response.json();
  return responseData.data;
};
