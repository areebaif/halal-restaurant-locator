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
  hoverId: undefined,
  //refreshMapData: false,
};

export type MapProps = {
  hoverId: number | undefined | string;
};

export const geolocationSlice = createSlice({
  name: "geolocation-input",
  initialState,
  reducers: {
    setHoverId: (state, action: PayloadAction<number | undefined | string>) => {
      state.hoverId = action.payload;
    },
  },
});

export const { setHoverId } = geolocationSlice.actions;

export default geolocationSlice.reducer;
