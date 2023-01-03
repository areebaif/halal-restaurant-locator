import { PropertiesProps } from "../components/search-map-display";
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

export interface FetchAutomplete {
  citySet: cityDocument[];
  stateSet: stateDocument[];
  zipSet: ZipDocument[];
  city_state: string[];
  allValues: string[];
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

export const fetchStateSearch = async (stateId: number) => {
  // 0 is a falsy value
  if (stateId === 0 ? false : !stateId)
    throw new Error("provide state id to call backend function");
  const url = `/api/dev/state/${stateId}`;
  const response = await fetch(url, {
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
  console.log("data", data);
  return data.data;
};

export const fetchStateAndCitySearch = async (
  stateId: number,
  cityId: number
) => {
  if ((stateId === 0 ? false : !stateId) || (cityId === 0 ? false : !cityId))
    throw new Error("provide state id to call backend function");
  const url = `/api/dev/state-city/${stateId}/${cityId}`;
  const response = await fetch(url, {
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

// TODO: fix this function
export const fetchRestaurantNameSearch = async (name: string) => {
  const url = `/api/dev/restaurant/${name}`;
  const response = await fetch(`/api/dev/restaurant/${name}`, {
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
