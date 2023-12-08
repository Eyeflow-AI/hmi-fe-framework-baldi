import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

const loginByIp = createAsyncThunk(
  'auth/login/ip',
  (payload, thunkApi) => {
    return API.post.loginByIp()
      .then((data) => {
        if (!data.ok) {
          return thunkApi.rejectWithValue({ message: data.message });
        } else {
          return data;
        }
      })
      .catch((err) => {
        let errMessage = err?.response?.data?.err ?? err?.response?.data?.message ?? err.message;
        return thunkApi.rejectWithValue({ message: errMessage });
      })
  }
);

export default loginByIp;