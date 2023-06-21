import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

const alertsThunk = createAsyncThunk(
  'app/alerts',
  (payload, thunkApi) => {
    return API.get.alert({stationId: payload.stationId})
      .then((data) => data)
      .catch((err) => thunkApi.rejectWithValue({ message: err.message }))
  }
);

export default alertsThunk;