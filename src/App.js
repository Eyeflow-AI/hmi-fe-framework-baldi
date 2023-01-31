import React, {useEffect} from 'react';

import { useDispatch } from 'react-redux';
import AdapterDateFNS from '@date-io/date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { BrowserRouter, useRoutes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { getUserAuthenticated, getHasUserManagementPermission, getHasCaptureImagesPermission } from './store/slices/auth';
import { instance } from './api';
import { getStationList, setStation } from './store/slices/app';
import getStationListThunk from './store/thunks/stationList';

import routes from './routes';

import theme from './theme';
import addInterceptors from './api/addInterceptors';

addInterceptors(instance);

function App() {

  const dispatch = useDispatch();

  const authenticated = useSelector(getUserAuthenticated);
  const hasUserManagementPermission = useSelector(getHasUserManagementPermission);
  const hasCaptureImagesPermission = useSelector(getHasCaptureImagesPermission);
  const stationList = useSelector(getStationList);

  const Routes = () => useRoutes(routes({authenticated, hasUserManagementPermission, hasCaptureImagesPermission}));

  useEffect(() => {
    dispatch(getStationListThunk())
  }, [dispatch]);

  useEffect(() => {
    //TODO select station logic
    if (stationList?.[0]?.label) {
      dispatch(setStation(stationList[0].label));
    };
  }, [dispatch, stationList]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFNS}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
