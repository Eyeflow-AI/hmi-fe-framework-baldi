import { createSlice } from '@reduxjs/toolkit';
import stationList from '../thunks/stationList';
import partsList from '../thunks/partsList';
import feConfig from '../thunks/feConfig';
import alerts from '../thunks/alerts';

// VARIABLES
export const initialState = {
  stationId: "",
  stationList: [],
  loadingStationList: false,

  partsList: [],
  partsObj: {},
  partsListHash: null,
  loadingPartsList: false,

  loadingAlerts: false,
  alertsHash: null,
  alerts: [],
  feConfig: null,
  loadingFeConfig: false,
  languageList: [],
  appBarButtonList: [],
  notificationBar: {
    show: false,
    message: '',
    type: '',
  }
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setStationId: (state, action) => {
      state.stationId = action.payload;
    },
    setLanguageList: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.languageList = action.payload;
      }
      else {
        state.languageList = [];
      }
    },
    setAppBarButtonList: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.appBarButtonList = action.payload;
      }
      else {
        state.appBarButtonList = [];
      }
    },
    setNotificationBar: (state, action) => {
      state.notificationBar = { ...action.payload };
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

      .addCase(partsList.pending, (state) => {
        state.loadingPartsList = true;
      })
      .addCase(partsList.fulfilled, (state, action) => {
        state.loadingPartsList = false;
        if (action.payload.hash !== state.partsListHash) {
          console.log("Updated partsList");
          let partsList = action.payload.partsList ?? [];
          state.partsList = partsList;
          let partsObj = {};
          partsList.forEach((part) => {
            partsObj[part.part_id] = part;
          });
          state.partsObj = partsObj;
          state.partsListHash = action.payload.hash ?? null;
        }
        else {
          console.log("partsList unchanged");
        }
      })
      .addCase(partsList.rejected, (state) => {
        state.loadingPartsList = false;
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
      })

      .addCase(alerts.pending, (state) => {
        state.loadingAlerts = true;
      })
      .addCase(alerts.fulfilled, (state, action) => {
        state.loadingAlerts = false;
        if (state.alertsHash !== action.payload.alertsHash) {
          state.alerts = action.payload.alerts ?? [];
          state.alertsHash = action.payload.alertsHash ?? null;
        };
      })
      .addCase(alerts.rejected, (state) => {
        state.loadingAlerts = false;
      });

  },
});

export const getStation = (state) => (Boolean(state.app.stationId) && state.app.stationList.length > 0)
  ? (state.app.stationList.find(el => el._id === state.app.stationId) ?? null)
  : null;
export const getStationId = (state) => state.app.stationId;
export const getStationList = (state) => state.app.stationList ?? [];

export const getPartsList = (state) => state.app.partsList ?? [];
export const getPartsObj = (state) => state.app.partsObj ?? {};

export const getFeConfig = (state) => state.app.feConfig;
export const getNotificationBarInfo = (state) => state.app.notificationBar;

export const getLanguageList = (state) => state.app.languageList;
export const getAppBarButtonList = (state) => state.app.appBarButtonList;

export const setStationId = appSlice.actions.setStationId;
export const setLanguageList = appSlice.actions.setLanguageList;
export const setAppBarButtonList = appSlice.actions.setAppBarButtonList;
export const setNotificationBar = appSlice.actions.setNotificationBar;

export default appSlice;