import { useEffect, Fragment, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import getStationListThunk from './store/thunks/stationList';
import getFeConfigThunk from './store/thunks/feConfig';
import {getFeConfig} from './store/slices/app';
import { prepare as prepareLocale } from './locale';

import Clock from './utils/Hooks/Clock';

                                                       //10 minutes
function ConfigProvider({ children, getConfigSleepTime=10*60*1000 }) {

  const dispatch = useDispatch();
  const {clock} = Clock({sleepTime: getConfigSleepTime});
  const feConfig = useSelector(getFeConfig);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    dispatch(getFeConfigThunk());
    // eslint-disable-next-line
  }, [clock]);

  useEffect(() => {
    dispatch(getStationListThunk());
  }, [dispatch]);

  useEffect(() => {
    if (feConfig) {
      Object.assign(window.app_config, feConfig.feConfig);
      console.log("App config", window.app_config);
      console.log("App Locale", feConfig.locale.locale)
      prepareLocale(window.app_config.locale, feConfig.locale.locale);
      setConfigLoaded(true);
    };
  }, [feConfig]);

  return (
    <Fragment>
      {configLoaded
        ? children
        : "Getting Config..."
      }
    </Fragment>
  );
};

export default ConfigProvider;
