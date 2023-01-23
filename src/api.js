import axios from 'axios';
import store from './store';
import authSlice from './store/slices/auth';

const instance = axios.create({
    baseURL: window.WS_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

instance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
      let token = store.getState()?.auth?.user?.token;
      config.headers.Authorization =  token ? `Bearer ${token}` : '';
  };

  return config;
},
);

instance.interceptors.response.use(
(response) => response,
(error) => {
    let errMessage = error?.response?.data?.err;

    if (errMessage === 'jwt expired') {
        store.dispatch(authSlice.actions.logout());
    }
    else {
        return Promise.reject(error);
    };
}
);


function request (request, setLoading) {
  return new Promise((resolve, reject) => {
    if (Boolean(setLoading)) {
      setLoading(true);
    };
    request.then((result) => {
      if (result.data) {
        
        resolve(result.data);
      }
      else {
        let errMessage;
        if (result.data && result.data.error && result.data.error.message) {
          errMessage = result.data.error.message;
        }
        else {
          errMessage = 'Request Failed.';
        };
        
        reject(new Error(errMessage));
      };
    })
    .catch((err) => {
      reject(err)
    })
    .finally(() => {
      if (Boolean(setLoading)) {
          setLoading(false);
      ;}
    });
  })
};

const API = {
  wsURL: window.WS_URL,
  login: ({username, password}, setLoading) => request(instance.post(`auth/login`, {username, password}), setLoading),
};


export default API;