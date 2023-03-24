import { createSlice } from '@reduxjs/toolkit';
import stationList from '../thunks/stationList';
import feConfig from '../thunks/feConfig';

// VARIABLES
export const initialState = {
  stationId: "",
  stationList: [],
  loadingStationList: false,

  feConfig: null,
  loadingFeConfig: false
};
  
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setStationId: (state, action) => {
      state.stationId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(stationList.pending, (state) => {
        state.loadingStationList = true;
      })
      .addCase(stationList.fulfilled, (state, action) => {
        state.loadingStationList = false;
        state.stationList = action.payload.stationList ?? [];
      })
      .addCase(stationList.rejected, (state) => {
        state.loadingStationList = false;
      })

      .addCase(feConfig.pending, (state) => {
        state.loadingFeConfig = true;
      })
      .addCase(feConfig.fulfilled, (state, action) => {
        state.loadingFeConfig = false;
        if (state.feConfig?.datetime !== action.payload?.datetime) {
          state.feConfig = action.payload ?? null;
        };
      })
      .addCase(feConfig.rejected, (state) => {
        state.loadingFeConfig = false;
      });
  },
});

export const getStation = (state) => (Boolean(state.app.stationId) && state.app.stationList.length > 0)
                                     ? (state.app.stationList.find(el => el._id === state.app.stationId) ?? null)
                                     : null;
export const getStationId = (state) => state.app.stationId;
export const getStationList = (state) => state.app.stationList ?? [];

export const getFeConfig = (state) => state.app.feConfig;

export const setStationId = appSlice.actions.setStationId;

export default appSlice;