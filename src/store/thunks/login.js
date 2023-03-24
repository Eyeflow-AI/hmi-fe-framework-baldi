import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

const login = createAsyncThunk(
  'auth/login',
  (payload, thunkApi) => {
    return API.post.login({ username: payload.username, password: payload.password })
      .then((data) => data)
      .catch((err) => {
        let errMessage = err?.response?.data?.err ?? err?.response?.data?.message ?? err.message;
        return thunkApi.rejectWithValue({ message: errMessage });
      })
  }
);

export default login;