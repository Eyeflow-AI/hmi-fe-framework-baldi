import store from '../store';
import authSlice from '../store/slices/auth';
import { setNotificationBar } from '../store/slices/app';

export default function addInterceptors(instance) {

  instance.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        let token = store.getState()?.auth?.user?.token;
        config.headers.Authorization = token ? `Bearer ${token}` : '';
      };

      return config;
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      let errMessage = error?.response?.data?.err;
      console.log({ errMessage })

      if (errMessage === 'jwt expired') {
        store.dispatch(authSlice.actions.logout());
      }
      if (errMessage === 'Wrong username/password') {
        store.dispatch(setNotificationBar({ show: true, type: 'error', message: 'wrong_username_password' }));
      }
      else {
        return Promise.reject(error);
      };
    }
  );
};