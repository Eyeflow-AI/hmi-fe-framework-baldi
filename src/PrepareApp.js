import { useEffect, Fragment, Suspense } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'react-redux';
import { instance } from './api';
import { getStationList, getStationId, setStationId } from './store/slices/app';
import getStationListThunk from './store/thunks/stationList';

import addInterceptors from './api/addInterceptors';

addInterceptors(instance);

function PrepareApp({ children }) {

  const dispatch = useDispatch();

  const stationList = useSelector(getStationList);
  const stationId = useSelector(getStationId);

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
