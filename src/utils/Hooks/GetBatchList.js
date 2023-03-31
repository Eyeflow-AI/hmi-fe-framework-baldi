import { useState, useEffect } from 'react';


import API from '../../api';
import Clock from './Clock';


export default function GetBatchList({ stationId, queryParams, sleepTime = 30000 } = {}) {


  const [data, setData] = useState({ batchList: [], hash: null });
  const [loading, setLoading] = useState(null);
  const {clock} = Clock({sleepTime});

  const loadBatchList = () => {
    if (queryParams && stationId) {
      API.get.batchList({ stationId, params: queryParams}, setLoading)
        .then((response) => {
          let hash = response.hash;

          if (hash !== data.hash) {
            setData(response);
          }
          else {
            console.log(`List not updated. Hash ${data.hash}`);
          };
        })
        .catch(console.log);
    };
  };

  useEffect(() => {
    loadBatchList();
    // eslint-disable-next-line
  }, [stationId, clock, queryParams]);

  return { batchList: data.batchList, loading, loadBatchList };
};