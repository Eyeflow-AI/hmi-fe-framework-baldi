import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

const checkVersionThunk = createAsyncThunk(
  'app/checkForReload',
  (payload, thunkApi) => {
    return API.get.checkVersion()
    .then((data) => data)
    .catch((err) => thunkApi.rejectWithValue({ message: err.message }))
  }
);

export default checkVersionThunk;
