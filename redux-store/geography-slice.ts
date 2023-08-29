import { ResponseGetAllGeog } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  allGeographyData: {
    zipcode: [""],
    city: [""],
    isError: false,
  },
};

export const geolocationSlice = createSlice({
  name: "geolocation-input",
  initialState,
  reducers: {
    setAutoCompleteGeogData: (
      state,
      action: PayloadAction<{ geography: ResponseGetAllGeog; isError: boolean }>
    ) => {
      const geog = action.payload;
      state.allGeographyData = {
        zipcode: geog.geography.zipcode,
        city: geog.geography.city,
        isError: geog.isError,
      };
    },
  },
});

export const { setAutoCompleteGeogData } = geolocationSlice.actions;

export default geolocationSlice.reducer;
