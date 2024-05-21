import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

const feConfig = createAsyncThunk("fe/config", (payload, thunkApi) => {
  return API.get
    .configForFE()
    .then((data) => {
      console.log({ feConfig: data });
      return data;
    })
    .catch((err) => thunkApi.rejectWithValue({ message: err.message }));
});

export default feConfig;
