import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ActiveGeolocation {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  index: number | undefined | string;
}

export interface MapCameraView {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export interface Map {
  dataSourceId: string;
  layerId: string;
  allGeolocationsData: GeoJSON.FeatureCollection<GeoJSON.Geometry, any>;
  mapGeoLocationCardData: ActiveGeolocation;
  //mapCameraView: MapCameraView | undefined;
  isOpenMapGeolocationCard: boolean;
  isOpenListGeolocationCard: boolean;
  refreshMapData: boolean;
  hoverId: number | undefined | string;
}

const initialState: Map = {
  dataSourceId: "restaurant locations",
  layerId: "points",
  allGeolocationsData: {
    type: "FeatureCollection",
    features: [],
  },
  isOpenListGeolocationCard: false,
  mapGeoLocationCardData: {
    latitude: 0,
    longitude: 0,
    title: "",
    description: "",
    index: undefined,
  },
  //mapCameraView: undefined,
  isOpenMapGeolocationCard: false,
  refreshMapData: false,
  hoverId: undefined,
};

export const geolocationSlice = createSlice({
  name: "geolocation-input",
  initialState,
  reducers: {
    setAllGoelocationData: (
      state,
      action: PayloadAction<GeoJSON.FeatureCollection<GeoJSON.Geometry, any>>
    ) => {
      state.allGeolocationsData = action.payload;
    },
    setMapGeolocationCardData: (
      state,
      action: PayloadAction<ActiveGeolocation>
    ) => {
      state.mapGeoLocationCardData = action.payload;
    },
    setIsOpenMapGeolocationCard: (state, action: PayloadAction<boolean>) => {
      state.isOpenMapGeolocationCard = action.payload;
    },
    setIsOpenListGeolocationCard: (state, action: PayloadAction<boolean>) => {
      state.isOpenListGeolocationCard = action.payload;
    },
    setRefreshMapData: (state, action: PayloadAction<boolean>) => {
      state.refreshMapData = action.payload;
    },
    setHoverId: (state, action: PayloadAction<number | string | undefined>) => {
      state.hoverId = action.payload;
    },
  },
});

export const {
  setMapGeolocationCardData,
  setAllGoelocationData,
  setHoverId,
  setIsOpenMapGeolocationCard,
  setRefreshMapData,
  setIsOpenListGeolocationCard,
} = geolocationSlice.actions;

export default geolocationSlice.reducer;
