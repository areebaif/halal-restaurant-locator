// TODO: extratc out main function put it here

export interface RestaurantDocument {
  type: "Feature";
  properties: {
    name: string;
    image_url?: string[];
    description?: string;
    menu_url?: string;
    updated_at: string;
    website_url?: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
  id: number;
  geometry: {
    coordinates: [number, number];
    type: "Point";
  };
}

export interface CityDocument {
  id: number;
  name: string;
  state_id: number;
  country_id?: number;
}

export interface StateDocument {
  id: number;
  name: string;
  country_id?: number;
}
export interface ZipDocument {
  type: "Feature";
  properties: {
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
  id: number;
  geometry: {
    coordinates: [number, number];
    type: "Point";
  };
}

export interface streetDocument {
  id: number;
  state_id: number;
  city_id: number;
  zipcode_id: number;
  country_id: number;
  name: string;
  created_at?: string;
}

export interface DistinctRestaurantNames {
  name: string;
  country_id: number;
}

export interface FetchAutomplete {
  citySet: CityDocument[];
  stateSet: StateDocument[];
  zipSet: ZipDocument[];
  city_state: string[];
  autoCompleteData: { value: string; label: string; description?: string }[];
  restaurantSet: RestaurantDocument[];
  distinctRestaurantNames: DistinctRestaurantNames[];
  street: streetDocument[];
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

export const fetchZipSearch = async (zipcodeUserInput: string | null) => {
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
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry, any>["features"];
  } = await response.json();
  return data.data;
};

export const fetchRestaurantNameSearch = async (
  restaurantName: string | null
) => {
  if (!restaurantName) throw new Error("provide zipcode value");
  const response = await fetch(`/api/restaurant/${restaurantName}`, {
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
      RestaurantDocument
    >["features"];
  } = await response.json();
  return data.data;
};

export const fetchRestaurantIdSearch = async (restaurantId: string | null) => {
  if (!restaurantId) throw new Error("provide zipcode value");
  const response = await fetch(`/api/restaurantId/${restaurantId}`, {
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
      RestaurantDocument
    >["features"];
  } = await response.json();
  return data.data;
};

export const fetchStateSearch = async (stateId: string | null) => {
  if (!stateId) throw new Error("provide state id to call backend function");
  const url = `/api/dev/zipcodes/state/${stateId}`;
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
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry, any>["features"];
  } = await response.json();
  return data.data;
};

export const fetchStateAndCitySearch = async (
  stateId: string | null,
  cityId: string | null
) => {
  if (!stateId || !cityId)
    throw new Error("provide state id and city id to call backend function");
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
    data: GeoJSON.FeatureCollection<GeoJSON.Geometry, any>["features"];
  } = await response.json();
  console.log("data inside func", data);
  return data.data;
};
