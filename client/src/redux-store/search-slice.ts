import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Action } from "history";

export interface SearchUserInput {
  zipcodeInput: string;
  cityInput: string;
  stateInput: string;
  restaurantNameInput: string;
  hasNavigated: boolean;
}

// Define the initial state using that type
const initialState: SearchUserInput = {
  zipcodeInput: "",
  cityInput: "",
  stateInput: "",
  restaurantNameInput: "",
  hasNavigated: false,
};

export const SearchSlice = createSlice({
  name: "user-search-input",
  initialState,
  reducers: {
    onZipcodeChange: (state, action: PayloadAction<string>) => {
      state.zipcodeInput = action.payload;
    },
    onStateChange: (state, action: PayloadAction<string>) => {
      state.stateInput = action.payload;
    },
    onCityChange: (state, action: PayloadAction<string>) => {
      state.cityInput = action.payload;
    },
    onRestaurantNameChange: (state, action: PayloadAction<string>) => {
      state.restaurantNameInput = action.payload;
    },

    onNavigation: (state, action: PayloadAction<boolean>) => {
      state.hasNavigated = action.payload;
    },
  },
});

export const {
  onZipcodeChange,
  onStateChange,
  onCityChange,
  onRestaurantNameChange,
  onNavigation,
} = SearchSlice.actions;

export default SearchSlice.reducer;
