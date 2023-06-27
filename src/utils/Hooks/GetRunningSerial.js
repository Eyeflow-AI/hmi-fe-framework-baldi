import { useState, useEffect } from 'react';


import API from '../../api';
import Clock from './Clock';


export default function GetRunningSerial({ stationId, sleepTime = 30000 } = {}) {


  const [data, setData] = useState({ serial: null });
  const [loading, setLoading] = useState(null);
  const { clock } = Clock({ sleepTime });

  const loadRunningSerial = () => {
    if (stationId) {
      API.get.runningSerial({ stationId }, setLoading)
        .then((response) => {
          let serial = response.serial;

          if (JSON.stringify(serial) !== JSON.stringify(data.serial)) {
            console.log('bulbasaur')
            setData(response);
          }
          else {
            console.log(`Running serial did not update`);
          };
        })
        .catch(console.log);
    };
  };

  console.log({ data })
  useEffect(() => {
    loadRunningSerial();
    // eslint-disable-next-line
  }, [clock, stationId]);

  return { runningSerial: data.serial, loading, loadRunningSerial };
};