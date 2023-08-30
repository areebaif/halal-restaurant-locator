import { GeoJsonRestaurantProps, ResponseGetAllGeog } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// const initialState = {
//   allGeographyData: {
//     zipcode: [""],
//     city: [""],
//     isError: false,
//   },
// };

const initialState: MapProps = {
  dataSourceId: "restaurant locations",
  layerId: "points",
  geolocations: {
    type: "FeatureCollection",
    features: [],
  },
};

export type MapProps = {
  dataSourceId: string;
  layerId: string;
  geolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonRestaurantProps
  >;
};

export const geolocationSlice = createSlice({
  name: "geolocation-input",
  initialState,
  reducers: {
    setGoelocations: (
      state,
      action: PayloadAction<
        GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJsonRestaurantProps>
      >
    ) => {
      state.geolocations = action.payload;
    },
  },
});

export const { setGoelocations } = geolocationSlice.actions;

export default geolocationSlice.reducer;
