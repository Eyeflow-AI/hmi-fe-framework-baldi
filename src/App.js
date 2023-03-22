import React, {useEffect, Suspense} from 'react';

import { useDispatch } from 'react-redux';
import AdapterDateFNS from '@date-io/date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useRoutes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { getUserAuthenticated, getHasUserManagementPermission, getHasCaptureImagesPermission } from './store/slices/auth';
import { instance } from './api';
import { getStationList, getStationId, setStationId } from './store/slices/app';
import getStationListThunk from './store/thunks/stationList';

import GetRoutes from './GetRoutes';

import theme from './theme';
import addInterceptors from './api/addInterceptors';

addInterceptors(instance);

function App() {

  const dispatch = useDispatch();

  const authenticated = useSelector(getUserAuthenticated);
  const hasUserManagementPermission = useSelector(getHasUserManagementPermission);
  const hasCaptureImagesPermission = useSelector(getHasCaptureImagesPermission);
  const stationList = useSelector(getStationList);
  const stationId = useSelector(getStationId);

  const routesList = GetRoutes({authenticated, hasUserManagementPermission, hasCaptureImagesPermission});
  const Routes = () => useRoutes(routesList);

  useEffect(() => {
    dispatch(getStationListThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!stationId && stationList?.[0]?._id) {
      dispatch(setStationId(stationList[0]._id));
    };
  }, [dispatch, stationId, stationList]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFNS}>
        <Suspense fallback={<p> Loading...</p>}>
          <Routes />
        </Suspense>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
