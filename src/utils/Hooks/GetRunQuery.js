import { useState, useEffect } from 'react';


import API from '../../api';
import Clock from './Clock';
import {isEqual} from 'lodash';

export default function GetRunQuery({ data, stationId, sleepTime = 30000, run } = {}) {


  const [queryResponse, setQueryResponse] = useState(null);
  const [loading, setLoading] = useState(null);
  const {clock} = Clock({sleepTime});

  const loadQuery = () => {
      if (run) {
        let dataToSend = JSON.parse(data);
        API.post.runQuery({ ...dataToSend }, setLoading)
        .then((response) => {
          let data = response?.result;
           setQueryResponse(data);
        })
        .catch(console.log)
      }
  };

  useEffect(() => {
    loadQuery();
    // eslint-disable-next-line
  }, [clock, stationId]);

  return { queryResponse, loading, loadQuery };
};