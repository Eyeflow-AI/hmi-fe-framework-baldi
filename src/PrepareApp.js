import {useEffect, Suspense} from 'react';

import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, matchPath } from 'react-router-dom';

import { instance } from './api';
import { getStationList, getStation, setStationId } from './store/slices/app';
import getStationListThunk from './store/thunks/stationList';

import addInterceptors from './api/addInterceptors';

addInterceptors(instance);

// const pagePathList = Object.entries(window.app_config.pages).map(([key, value]) => value.path);

function PrepareApp({children}) {

  const dispatch = useDispatch();
  // const location = useLocation();

  const stationList = useSelector(getStationList);
  const station = useSelector(getStation);
  const stationId = station?._id ?? null;
  // const stationSlugLabel = station?.slugLabel ?? "";

  useEffect(() => {
    dispatch(getStationListThunk());
  }, [dispatch]);

  // useEffect(() => {
  //   let thisMatch;
  //   for (let pagePath of pagePathList) {
  //     let match = matchPath({path: pagePath}, location.pathname);
  //     if (match) {
  //       thisMatch = match;
  //       break;
  //     };
  //   };

  //   if (thisMatch) {
  //     TODO
  //     console.log(stationSlugLabel, location.state, thisMatch);
  //     if (thisMatch.params.stationSlugLabel && thisMatch.params.stationSlugLabel !== stationSlugLabel) {

  //     }
  //   }
  //   else {
  //     //TODO Error handling
  //     console.error("Something went wrong");
  //   }
  // }, [location, stationSlugLabel]);

  useEffect(() => {
    if (stationList?.length > 0) {
      if ( !stationId || (stationId && stationList.findIndex((el) => el._id === stationId) === -1 ) ) {
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
