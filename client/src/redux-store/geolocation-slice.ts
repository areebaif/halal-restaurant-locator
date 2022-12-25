import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ActiveGeolocation {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  index: number | undefined;
}

export interface MapCameraView {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export interface Map {
  dataSourceId: string;
  layerId: string;
  geolocationData: GeoJSON.FeatureCollection<GeoJSON.Geometry, any> | undefined;
  activeGeolocation: ActiveGeolocation;
  mapCameraView: MapCameraView | undefined;
  isOpenActiveGeolocationCard: boolean;
  refreshMapData: boolean;
  hoverId: number | undefined;
}

const initialState: Map = {
  dataSourceId: "restaurant locations",
  layerId: "points",
  geolocationData: undefined,
  activeGeolocation: {
    latitude: 0,
    longitude: 0,
    title: "",
    description: "",
    index: undefined,
  },
  mapCameraView: undefined,
  isOpenActiveGeolocationCard: false,
  refreshMapData: false,
  hoverId: undefined,
};

export const geolocationSlice = createSlice({
  name: "geolocation-input",
  initialState,
  reducers: {
    onGoelocationDataChange: (
      state,
      action: PayloadAction<GeoJSON.FeatureCollection<GeoJSON.Geometry, any>>
    ) => {
      state.geolocationData = action.payload;
    },
    onActiveGeolocationChange: (
      state,
      action: PayloadAction<ActiveGeolocation>
    ) => {
      state.activeGeolocation = action.payload;
    },
    onIsOpenActiveGeolocationCardChange: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isOpenActiveGeolocationCard = action.payload;
    },
    onRefreshMapDataChange: (state, action: PayloadAction<boolean>) => {
      state.refreshMapData = action.payload;
    },
    onHoverIdChange: (state, action: PayloadAction<number>) => {
      state.hoverId = action.payload;
    },
    onMapCameraViewChange: (state, action: PayloadAction<MapCameraView>) => {
      state.mapCameraView = action.payload;
    },
  },
});

export const {
  onActiveGeolocationChange,
  onGoelocationDataChange,
  onHoverIdChange,
  onIsOpenActiveGeolocationCardChange,
  onRefreshMapDataChange,
  onMapCameraViewChange,
} = geolocationSlice.actions;

export default geolocationSlice.reducer;
