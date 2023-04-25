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
    batch: ({ stationId, data }, setLoading) => request(instance.post(`batch/${stationId}`, data), setLoading),
    user: ({ username, password }, setLoading) => request(instance.post(`auth/user`, { username, password }), setLoading),
  },
  get: {
    batchList: ({ params, stationId }, setLoading) => request(instance.get(`batch/${stationId}/list`, { params }), setLoading),
    serialList: ({ params, stationId }, setLoading) => request(instance.get(`batch/${stationId}/list`, { params }), setLoading),
    runningBatch: ({ stationId }, setLoading) => request(instance.get(`batch/${stationId}/running`), setLoading),
    runningSerial: ({ stationId }, setLoading) => request(instance.get(`batch/${stationId}/running`), setLoading),
    batch: ({ stationId, batchId }, setLoading) => request(instance.get(`batch/${stationId}/${batchId}`), setLoading),
    batchData: ({ stationId, batchId }, setLoading) => request(instance.get(`batch/${stationId}/${batchId}/data`), setLoading),
    eventList: ({ params }, setLoading) => request(instance.get(`event/list`, { params }), setLoading),
    event: ({ eventId }, setLoading) => request(instance.get(`event/${eventId}`), setLoading),
    stations: (_, setLoading) => request(instance.get(`station/list`), setLoading),
    configForFE: (setLoading) => request(instance.get(`config/fe`), setLoading),

    packageData: (setLoading) => request(instance.get(`internal/package-data`), setLoading),
    languagesData: (setLoading) => request(instance.get(`internal/languages-data`), setLoading),
    iconInfo: ({ icon }, setLoading) => request(instance.get(`internal/icon-info/${icon}`), setLoading),

    fromToDocument: (setLoading) => request(instance.get(`internal/from-to-document/`), setLoading),

    queryData: ({ stationId, queryName, startTime, endTime }, setLoading) => request(instance.get(`queries/${stationId}/data`, { params: { queryName, startTime, endTime } }), setLoading),

    query: ({ }, setLoading) => request(instance.get(`queries/`, setLoading)),
    accessControlData: (setLoading) => request(instance.get(`auth/access-control-data`), setLoading),
    userList: (setLoading) => request(instance.get(`auth/users-list`), setLoading),
  },
  put: {
    batchPause: ({ stationId, batchId }, setLoading) => request(instance.put(`batch/${stationId}/${batchId}/pause`), setLoading),
    batchResume: ({ stationId, batchId }, setLoading) => request(instance.put(`batch/${stationId}/${batchId}/resume`), setLoading),

    activeDataset: ({ status, datasetId }, setLoading) => request(instance.put(`internal/active-dataset`, { status, datasetId }), setLoading),
    activeLanguage: ({ status, languageId }, setLoading) => request(instance.put(`internal/active-language`, { status, languageId }), setLoading),
    defaultLanguage: ({ languageId }, setLoading) => request(instance.put(`internal/default-language`, { languageId }), setLoading),

    userRole: ({ username, newRole }, setLoading) => request(instance.put(`auth/user/role`, { username, newRole }), setLoading),
    resetPassword: ({ username, newPassword }, setLoading) => request(instance.put(`auth/user/reset-password`, { username, newPassword }), setLoading),

  },
  delete: {
    user: ({ username }, setLoading) => request(instance.delete(`auth/user`, { data: { username } }), setLoading),
  }
};


export default API;