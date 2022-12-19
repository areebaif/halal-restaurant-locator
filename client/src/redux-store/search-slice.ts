import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Action } from "history";

export interface SearchTerms {
  zipcode: string;
  city: string;
  state: string;
  restaurantName: string;
}

// Define the initial state using that type
const initialState: SearchTerms = {
  zipcode: "",
  city: "",
  state: "",
  restaurantName: "",
};

export const SearchSlice = createSlice({
  name: "user-search-input",
  initialState,
  reducers: {
    zipcodeChange: (state, action: PayloadAction<string>) => {
      state.zipcode = action.payload;
    },
    stateChange: (state, action: PayloadAction<string>) => {
      state.state = action.payload;
    },
    cityChange: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    restaurantNameChange: (state, action: PayloadAction<string>) => {
      state.restaurantName = action.payload;
    },
  },
});

export const { zipcodeChange, stateChange, cityChange, restaurantNameChange } =
  SearchSlice.actions;

export default SearchSlice.reducer;
