import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

const partsList = createAsyncThunk(
  'parts/list',
  (payload, thunkApi) => {
    return API.get.partsList()
      .then((data) => data)
      .catch((err) => thunkApi.rejectWithValue({ message: err.message }))
  }
);

export default partsList;