import { useEffect, Fragment, Suspense } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'react-redux';
import { instance } from './api';
import { getStationList, getStationId, setStationId } from './store/slices/app';
import getStationListThunk from './store/thunks/stationList';

import { prepare as prepareLocale } from './locale';

import addInterceptors from './api/addInterceptors';
import API from './api';

addInterceptors(instance);

function PrepareApp({ children }) {

  const dispatch = useDispatch();

  const stationList = useSelector(getStationList);
  const stationId = useSelector(getStationId);

  useEffect(() => {
    API.get.configForFE()
      .then((response) => {
        console.log({ response })
        let config = response.data;
        console.log({ response })
        console.log({ config })

        Object.freeze(config);

        window.app_config = Object.assign(window.app_config, config);

        prepareLocale(window.app_config.locale);
      })
      .catch(console.log)
  }, [])

  useEffect(() => {
    dispatch(getStationListThunk());
  }, [dispatch]);

  useEffect(() => {
    if (stationList?.length > 0) {
      if (!stationId || (stationId && stationList.findIndex((el) => el._id === stationId) === -1)) {
        dispatch(setStationId(stationList[0]._id));
      };
    }
    else {
      dispatch(setStationId(""));
    };
  }, [dispatch, stationId, stationList]);

  return (
    <Suspense fallback={<p> Loading...</p>}>
      {stationId
        ? children
        : "Missing station list"
      }
    </Suspense>
  );
};

export default PrepareApp;
