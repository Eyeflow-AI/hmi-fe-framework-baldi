import { useState, useEffect } from 'react';


import API from '../../api';
import Clock from './Clock';


export default function GetSerialList({ stationId, queryParams, sleepTime = 30000 } = {}) {


  const [data, setData] = useState({ serialList: [], hash: null });
  const [loading, setLoading] = useState(null);
  const { clock } = Clock({ sleepTime });

  const loadSerialList = () => {
    if (queryParams && stationId) {
      API.get.serialList({ stationId, params: queryParams }, setLoading)
        .then((response) => {
          let hash = response.hash;

          if (hash !== data.hash) {
            setData(response);
          }
          else {
            // console.log(`List not updated. Hash ${data.hash}`);
          };
        })
        .catch(console.log);
    };
  };

  useEffect(() => {
    loadSerialList();
    // eslint-disable-next-line
  }, [stationId, clock, queryParams]);

  return { serialList: data.serialList, loading, loadSerialList };
};