import { createSlice } from '@reduxjs/toolkit';
import login from '../thunks/login';
import loginByIp from '../thunks/loginByIp';

// VARIABLES
export const initialState = {
  user: null,
  loadingLogin: false,
  loadingLoginByIp: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state, action) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loadingLogin = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loadingLogin = false;
        // console.log({ action })
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.loadingLogin = false;
      })
      .addCase(loginByIp.pending, (state) => {
        state.loadingLogin = true;
      })
      .addCase(loginByIp.fulfilled, (state, action) => {
        state.loadingLogin = false;
        state.user = action.payload;
      })
      .addCase(loginByIp.rejected, (state, action) => {
        state.loadingLogin = false;
      });
  },
});

// EXPOSING VARIABLES
export const getUser = (state) => state.auth.user;
export const getUserUsername = (state) => state.auth.user?.tokenPayload?.payload?.username;
export const getUserTokenPayload = (state) => state.auth.user?.tokenPayload?.payload;
export const getUserInitials = (state) => state.auth.user?.tokenPayload?.payload?.profile?.initials;
export const getUserAccessControl = (state) => state.auth.user?.tokenPayload?.payload?.accessControl;
// export const getHasUserManagementPermission = (state) => Boolean(state.auth.user?.tokenPayload?.payload?.accessControl?.userManagement);
// export const getHasCaptureImagesPermission = (state) => Boolean(state.auth.user?.tokenPayload?.payload?.accessControl?.captureImages);
export const getUserAuthenticated = (state) => Boolean(state.auth.user);
export const getLoadingLogin = (state) => state.auth.loadingLogin;

export default authSlice;
