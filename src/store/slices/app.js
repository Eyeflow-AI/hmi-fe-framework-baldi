import { createSlice } from '@reduxjs/toolkit';
import stationList from '../thunks/stationList';

// VARIABLES
export const initialState = {
  appbarTab: -1,

  station: "",
  stationList: [],
  loadingStationList: false,

  tabList: [],
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
    setStation: (state, action) => {
      state.station = action.payload;
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
      });
  },
});

export const getStation = (state) => state.app.station;
export const getStationList = (state) => state.app.stationList;

export const getAppbarTab = (state) => state.app.appbarTab;
export const getTabList = (state) => state.app.tabList;

export const setStation = appSlice.actions.setStation;

export default appSlice;