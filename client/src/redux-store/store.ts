import { configureStore } from "@reduxjs/toolkit";
import searchSliceReducer from "./search-slice";
import geolocationSliceReducer from "./geolocation-slice";

export const reduxStore = configureStore({
  reducer: {
    search: searchSliceReducer,
    geolocation: geolocationSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reduxStore.getState>;
// Inferred type: {search: SearchTermsInteface}
export type AppDispatch = typeof reduxStore.dispatch;

export default reduxStore;
