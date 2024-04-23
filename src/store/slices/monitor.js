import { createSlice } from "@reduxjs/toolkit";

// VARIABLES
export const initialState = {
  id: null,
  date: new Date(),
  hash: null,
  runningEvent: false,
};

export const monitorSlice = createSlice({
  name: "monitor",
  initialState,
  reducers: {
    // logout: (state, action) => {
    //   state.user = null;
    // },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setHash: (state, action) => {
      state.hash = action.payload;
    },
    setInitialState: (state, action) => {
      state.id = null;
      state.date = new Date();
      state.hash = null;
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(login.pending, (state) => {
    //     state.loadingLogin = true;
    //   })
    //   .addCase(login.fulfilled, (state, action) => {
    //     state.loadingLogin = false;
    //     // console.log({ action })
    //     state.user = action.payload;
    //   })
    //   .addCase(login.rejected, (state) => {
    //     state.loadingLogin = false;
    //   });
  },
});

// EXPOSING VARIABLES
export default monitorSlice;
