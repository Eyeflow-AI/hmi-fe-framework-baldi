import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

const login = createAsyncThunk(
  'auth/login',
  async (user, thunkApi) => {
    return API.login({username: user.username, password: user.password})
      .then((data) => data)
      .catch((err) => thunkApi.rejectWithValue({message: err.message}))
  }
);

export default login;