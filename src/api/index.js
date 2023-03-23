import axios from 'axios';


export const instance = axios.create({
  baseURL: window.app_config.ws_url,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

function request(request, setLoading) {
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
          ;
        }
      });
  })
};

const API = {
  wsURL: window.WS_URL,
  post: {
    login: ({ username, password }, setLoading) => request(instance.post(`auth/login`, { username, password }), setLoading),

  },
  get: {
    batchList: ({ params }, setLoading) => request(instance.get(`batch/list`, { params }), setLoading),
    batch: ({ batchId }, setLoading) => request(instance.get(`batch/${batchId}`), setLoading),
    eventList: ({ params }, setLoading) => request(instance.get(`event/list`, { params }), setLoading),
    event: ({ eventId }, setLoading) => request(instance.get(`event/${eventId}`), setLoading),
    stations: (_, setLoading) => request(instance.get(`station/list`), setLoading),
    configForFE: (setLoading) => request(instance.get(`config/config-for-fe`), setLoading),
  },
  put: {

  },
  delete: {

  }
};


export default API;