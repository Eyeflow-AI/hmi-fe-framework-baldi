import { createSlice } from '@reduxjs/toolkit';
import stationList from '../thunks/stationList';
import feConfig from '../thunks/feConfig';

// VARIABLES
export const initialState = {
  appbarTab: -1,

  stationId: "",
  stationList: [],
  loadingStationList: false,

  tabList: [],
  feConfig: null,
  loadingFeConfig: false
};
  
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppbarTabValue: (state, action) => {
      state.appbarTab = action.payload;
    },
    setTabListValue: (state, action) => {
      state.tabList = action.payload;
    },
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
        if (state.feConfig?.event_time !== action.payload?.event_time) {
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

export const getAppbarTab = (state) => state.app.appbarTab;
export const getTabList = (state) => state.app.tabList ?? [];

export const getFeConfig = (state) => state.app.feConfig;

export const setStationId = appSlice.actions.setStationId;

export default appSlice;