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
  wsURL: window.app_config.ws_url,
  post: {
    login: ({ username, password }, setLoading) => request(instance.post(`auth/login`, { username, password }), setLoading),

  },
  get: {
    batchList: ({ params, stationId }, setLoading) => request(instance.get(`batch/${stationId}/list`, { params }), setLoading),
    runningBatch: ({ stationId }, setLoading) => request(instance.get(`batch/${stationId}/running`), setLoading),
    batch: ({ stationId, batchId }, setLoading) => request(instance.get(`batch/${stationId}/${batchId}`), setLoading),
    eventList: ({ params }, setLoading) => request(instance.get(`event/list`, { params }), setLoading),
    event: ({ eventId }, setLoading) => request(instance.get(`event/${eventId}`), setLoading),
    stations: (_, setLoading) => request(instance.get(`station/list`), setLoading),
    configForFE: (setLoading) => request(instance.get(`config/fe`), setLoading),

    packageData: (setLoading) => request(instance.get(`internal/package-data`), setLoading),
    iconInfo: ({ icon }, setLoading) => request(instance.get(`internal/icon-info/${icon}`), setLoading),

    fromToDocument: (setLoading) => request(instance.get(`internal/from-to-document/`), setLoading),

    getData: ({ stationId, query, collectionType }, setLoading) => request(instance.get(`queries/${stationId}/data`, { query: { query, collectionType } }), setLoading),
  },
  put: {
    batchPause: ({ stationId, batchId }, setLoading) => request(instance.put(`batch/${stationId}/${batchId}/pause`), setLoading),
    batchResume: ({ stationId, batchId }, setLoading) => request(instance.put(`batch/${stationId}/${batchId}/resume`), setLoading),

    activeDataset: ({ status, datasetId }, setLoading) => request(instance.put(`internal/active-dataset`, { status, datasetId }), setLoading),
  },
  delete: {

  }
};


export default API;