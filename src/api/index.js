import axios from 'axios';

export const instance = axios.create({
    baseURL: window.WS_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

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