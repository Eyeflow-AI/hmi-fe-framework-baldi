import { useState, useEffect } from 'react';


import API from '../../api';
import Clock from './Clock';
import GetSelectedStation from './GetSelectedStation';


export default function GetActiveAlert({ sleepTime = 1000 } = {}) {

  const [data, setData] = useState({ activeAlert: null });
  const [loading, setLoading] = useState(null);
  const { clock } = Clock({ sleepTime });

  const { _id: stationId } = GetSelectedStation();


  const loadAlert = () => {
    if (stationId) {
      API.get.alert({ stationId }, setLoading)
        .then((response) => {
          let alert = response?.alert ?? null;

          if (alert) {
            setData(alert);
          }
          else {
            console.log(`no alert for station ${stationId}`);
          };
        })
        .catch(console.log)
    };
  };

  useEffect(() => {
    loadAlert();
    // eslint-disable-next-line
  }, [clock, stationId]);

  return { activeAlert: data.activeAlert, loading, loadAlert };
};