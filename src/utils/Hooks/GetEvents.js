import {useState, useEffect} from 'react';


import API from '../../api';
import Clock from './Clock';


export default function GetEvents({queryParams, sleepTime=30000}={}) {


  const {clock} = Clock({sleepTime});
  const [data, setData] = useState({eventList: [], hash: null});
  const [loading, setLoading] = useState(null);
  
  useEffect(() => {
    if (queryParams) {
      API.getEventList({params: queryParams, setLoading})
        .then((response) => {
          let hash = response.hash;

          if (!Boolean(hash) || !Boolean(data.hash) || hash !== data.hash) {
            setData(response);
          }
          else {
            // console.log(`List not updated. Hash ${data.hash}`);
          };
        })
        .catch(console.log);
    }
    // eslint-disable-next-line
  }, [clock, queryParams]);

  return {events: data.eventList, loading, setData};
};