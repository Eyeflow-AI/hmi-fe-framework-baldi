import { useEffect } from 'react';


import Clock from './Clock';
import GetSelectedStation from './GetSelectedStation';
import alertsThunk from '../../store/thunks/alerts';

import { useDispatch } from 'react-redux';

export default function AlertUpdated({ sleepTime = 2500 } = {}) {

  const dispatch = useDispatch();
  const { clock } = Clock({ sleepTime });
  const { _id: stationId } = GetSelectedStation();

  useEffect(() => {
    if (stationId) {
      dispatch(alertsThunk({stationId}));
    }
    // eslint-disable-next-line
  }, [clock, stationId]);

};