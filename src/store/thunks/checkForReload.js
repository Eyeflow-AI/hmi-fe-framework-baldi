import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

const checkForReloadThunk = createAsyncThunk(
  'app/checkForReload',
  (payload, thunkApi) => {
    return API.get.checkForReload(
      { params: { 'JSVersion': payload?.JSVersion } },
    )
    .then((data) => data)
    .catch((err) => thunkApi.rejectWithValue({ message: err.message }))
  }
);

export default checkForReloadThunk;
