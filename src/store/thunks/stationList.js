import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

const stationList = createAsyncThunk(
  'station/list',
  (user, thunkApi) => {
    return API.get.stations()
      .then((data) => data)
      .catch((err) => thunkApi.rejectWithValue({message: err.message}))
  }
);

export default stationList;