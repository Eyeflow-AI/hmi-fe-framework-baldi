import { createAsyncThunk } from '@reduxjs/toolkit';
// import API from '../../api';

const login = createAsyncThunk(
  'auth/login',
  (user, thunkApi) => {
    return {
      "ok":true,
      "token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2QwMzlmMmRkNzNjYTBkMDM1NDAzY2YiLCJwYXlsb2FkIjp7InVzZXJpZCI6IjYzNTAzZmQ2NzFhMDRmMjEyM2FkNTI1NSIsInVzZXJuYW1lIjoiZ2FicmllbG1lbG8iLCJhY2Nlc3NDb250cm9sIjp7InVzZXJNYW5hZ2VtZW50Ijp0cnVlLCJjYXB0dXJlSW1hZ2VzIjp0cnVlfSwicHJvZmlsZSI6eyJuYW1lIjoiR2FicmllbCBNZWxvIiwiaW5pdGlhbHMiOiJHTSJ9fSwiZXhwIjoxNjc0Njc3MTA2LCJpYXQiOjE2NzQ1OTA3MDZ9.kNss1SxqBWxLU8PUKYUZHW57F13p_s8r2zPluaCtWPN3hwOaRNqOM-DZh7VW3IBNdrX4Nx52PRIYyO54erG_W2KlUFmnVaQlyBXX1FwA5T_oqrxK7CZ_vU4cwz4EGu5qpbMdOKGXQ2tCA7nwIsbIFj2CffFKlNzTCLUR8XNYRYr3bteI8tj4G1jYa-LLSvt5ewPSiWbohlXkdpKOwqVRyt2QGUc1VPILq-2RLvhlbJBnpZ1tB27CxCKB_rnuzDTjl6jSzYKs0JZz6fsQSqqtaaurvKjmNYWO5Nfvfxcj_GMf7vDIqUZiPOErAxudwxPcKfKVt-OuV3vWYGqOj6z7l-UFI4NF9SN7WMtlKbgGvRJiJOwYbpxwUjENHxQEPIJbusnHb9N9vF3xkXBhBSK09MFGiQVHWotg_AgYdEN3MLz3IkPjm4U0mA4Ry8drLuphUYUFyXXyV5AskJ-H3ycma56E3GgMZIZyajlnpN9p1BOvVg3VLqmc4b6u_0MMIwGYhYtOviNbDq9zC9_LFtmnV-ddLf5EUZre5sxPrS-ja71OFMHgPwabgq9_FOre-yldq2mJqXJbJSWba1JNSrYrdTsD5ZQzInAmEkh8U2XZHV8e5arusKOU7MwZWn9leu5qZSkqHqzTfCyC_Y_8MtfYDqgz_O8-jKeM-th5qYnbYf4",
      "tokenPayload":{
        "_id":"63d039f2dd73ca0d035403cf",
        "payload":{"userid":"63503fd671a04f2123ad5255","username":"gabrielmelo","accessControl":{"userManagement":true,"captureImages":true},"profile":{"name":"Gabriel Melo","initials":"GM"}},"exp":1674677106,"iat":1674590706
      }
    };
    // return API.login({username: user.username, password: user.password})
    //   .then((data) => data)
    //   .catch((err) => thunkApi.rejectWithValue({message: err.message}))
  }
);

export default login;