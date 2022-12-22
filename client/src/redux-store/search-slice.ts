import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Action } from "history";

export interface SearchUserInput {
  zipcodeUserInput: string;
  cityUserInput: string;
  stateUserInput: string;
  restaurantNameUserInput: string;
  // backend input based on userInput
  zipcodeBackendInput: { id: number | undefined; name: string | undefined };
  cityBackendInput: { id: number | undefined; name: string | undefined };
  stateBackendInput: { id: number | undefined; name: string | undefined };
  restaurantBackendInput: {
    id: number | undefined;
    name: string | undefined;
  };
  // Fetch flags based on userInput
  fetchRestaurantZipcode: boolean;
  fetchRestaurantState: boolean;
  fetchRestaurantStateCity: boolean;
  fetchRestaurant: boolean;
  fetchZipcode: boolean;
  fetchStateCity: boolean;
  fetchState: boolean;
}

// Define the initial state using that type
const initialState: SearchUserInput = {
  zipcodeUserInput: "",
  cityUserInput: "",
  stateUserInput: "",
  restaurantNameUserInput: "",
  zipcodeBackendInput: { id: undefined, name: undefined },
  cityBackendInput: { id: undefined, name: undefined },
  stateBackendInput: { id: undefined, name: undefined },
  restaurantBackendInput: { id: undefined, name: undefined },
  fetchRestaurantZipcode: false,
  fetchRestaurantState: false,
  fetchRestaurantStateCity: false,
  fetchRestaurant: false,
  fetchZipcode: false,
  fetchStateCity: false,
  fetchState: false,
};

export const SearchSlice = createSlice({
  name: "user-search-input",
  initialState,
  reducers: {
    // userInputs
    onZipcodeUserInputChange: (state, action: PayloadAction<string>) => {
      state.zipcodeUserInput = action.payload;
    },
    onStateUserInputChange: (state, action: PayloadAction<string>) => {
      state.stateUserInput = action.payload;
    },
    onCityUserInputChange: (state, action: PayloadAction<string>) => {
      state.cityUserInput = action.payload;
    },
    onRestaurantNameUserInputChange: (state, action: PayloadAction<string>) => {
      state.restaurantNameUserInput = action.payload;
    },
    // backned Inputs
    onZipCodeBackendInputChange: (
      state,
      action: PayloadAction<{
        id: number | undefined;
        name: string | undefined;
      }>
    ) => {
      state.zipcodeBackendInput = action.payload;
    },
    onStateBackendInputChange: (
      state,
      action: PayloadAction<{
        id: number | undefined;
        name: string | undefined;
      }>
    ) => {
      state.stateBackendInput = action.payload;
    },
    onCityBackendInputChange: (
      state,
      action: PayloadAction<{
        id: number | undefined;
        name: string | undefined;
      }>
    ) => {
      state.cityBackendInput = action.payload;
    },
    onRestaurantdeBackendInputChange: (
      state,
      action: PayloadAction<{
        id: number | undefined;
        name: string | undefined;
      }>
    ) => {
      state.restaurantBackendInput = action.payload;
    },
    // query flags
    onFetchRestaurantZipcode: (state, action: PayloadAction<boolean>) => {
      state.fetchRestaurantZipcode = action.payload;
    },
    onFetchRestaurantState: (state, action: PayloadAction<boolean>) => {
      state.fetchRestaurantState = action.payload;
    },
    onFetchRestaurantStateCity: (state, action: PayloadAction<boolean>) => {
      state.fetchRestaurantStateCity = action.payload;
    },
    onFetchRestaurant: (state, action: PayloadAction<boolean>) => {
      state.fetchRestaurant = action.payload;
    },
    onFetchZipcode: (state, action: PayloadAction<boolean>) => {
      state.fetchZipcode = action.payload;
    },
    onFetchStateCity: (state, action: PayloadAction<boolean>) => {
      state.fetchStateCity = action.payload;
    },
    onFetchState: (state, action: PayloadAction<boolean>) => {
      state.fetchState = action.payload;
    },
  },
});

export const {
  onZipcodeUserInputChange,
  onStateUserInputChange,
  onCityUserInputChange,
  onRestaurantNameUserInputChange,
  onCityBackendInputChange,
  onStateBackendInputChange,
  onZipCodeBackendInputChange,
  onRestaurantdeBackendInputChange,
  onFetchRestaurant,
  onFetchRestaurantState,
  onFetchRestaurantStateCity,
  onFetchRestaurantZipcode,
  onFetchState,
  onFetchStateCity,
  onFetchZipcode,
} = SearchSlice.actions;

export default SearchSlice.reducer;
