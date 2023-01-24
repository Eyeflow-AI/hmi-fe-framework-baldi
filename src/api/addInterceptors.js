import store from '../store';
import authSlice from '../store/slices/auth';

export default function addInterceptors (instance) {

  instance.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        let token = store.getState()?.auth?.user?.token;
        config.headers.Authorization =  token ? `Bearer ${token}` : '';
      };
  
      return config;
    }
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
};