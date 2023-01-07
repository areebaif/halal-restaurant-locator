import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SearchUserInput {
  // backend input based on userInput
  zipcodeBackendInput: { id: number | null; name: string | null };
  cityBackendInput: { id: number | null; name: string | null };
  stateBackendInput: { id: number | null; name: string | null };
  restaurantBackendInput: {
    id: number | null;
    name: string | null;
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
  zipcodeBackendInput: { id: null, name: null },
  cityBackendInput: { id: null, name: null },
  stateBackendInput: { id: null, name: null },
  restaurantBackendInput: { id: null, name: null },
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
    // backned Inputs
    onZipCodeBackendInputChange: (
      state,
      action: PayloadAction<{
        id: number | null;
        name: string | null;
      }>
    ) => {
      state.zipcodeBackendInput = action.payload;
    },
    onStateBackendInputChange: (
      state,
      action: PayloadAction<{
        id: number | null;
        name: string | null;
      }>
    ) => {
      state.stateBackendInput = action.payload;
    },
    onCityBackendInputChange: (
      state,
      action: PayloadAction<{
        id: number | null;
        name: string | null;
      }>
    ) => {
      state.cityBackendInput = action.payload;
    },
    onRestaurantdeBackendInputChange: (
      state,
      action: PayloadAction<{
        id: number | null;
        name: string | null;
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
