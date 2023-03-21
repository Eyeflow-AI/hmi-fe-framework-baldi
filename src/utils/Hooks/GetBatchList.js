import {useState, useEffect} from 'react';


import API from '../../api';


export default function GetBatchList({queryParams, sleepTime=30000}={}) {


  const [tick, setTick] = useState(0);
  const [data, setData] = useState({batchList: [], hash: null});
  const [loading, setLoading] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(() => setTick(oldValue => oldValue + 1), sleepTime);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (queryParams) {
      API.getBatchList({params: queryParams, setLoading})
        .then((response) => {
          let hash = response.hash;

          if (!Boolean(hash) || !Boolean(data.hash) || hash !== data.hash) {
            setData(response);
          }
          else {
            console.log(`List not updated. Hash ${data.hash}`);
          };
        })
        .catch(console.log);
    }
    // eslint-disable-next-line
  }, [tick, queryParams]);

  return {batchList: data.batchList, loading, setData};
};