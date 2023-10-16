import { useState, useEffect } from 'react';


import API from '../../api';
import Clock from './Clock';


export default function GetRunningBatch({ stationId, sleepTime = 3000, automaticUpdate = true } = {}) {


  const [data, setData] = useState({ batch: null });
  const [loading, setLoading] = useState(null);
  const { clock } = Clock({ sleepTime, automaticUpdate });
  const loadRunningBatch = () => {
    if (stationId) {
      API.get.runningBatch({ stationId }, setLoading)
        .then((response) => {
          let batch = response.batch;

          if (JSON.stringify(batch) !== JSON.stringify(data.batch)) {
            setData(response);
          }
          else {
            // console.log(`Running batch did not update`);
          };
        })
        .catch(console.log);
    };
  };

  useEffect(() => {
    loadRunningBatch();
    // eslint-disable-next-line
  }, [clock, stationId]);

  return { runningBatch: data.batch, loading, loadRunningBatch };
};