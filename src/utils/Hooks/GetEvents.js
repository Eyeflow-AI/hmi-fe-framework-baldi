import {useState, useEffect} from 'react';


import API from '../../api';


export default function GetEvents({queryParams, sleepTime=30000}={}) {


  const [tick, setTick] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(() => setTick(oldValue => oldValue + 1), sleepTime);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (queryParams) {
      API.getEventList({params: queryParams, setLoading})
        .then((response) => {
          let newEvents = response?.eventList ?? [];
          if (JSON.stringify(events) !== JSON.stringify(newEvents)) {
            setEvents(newEvents);
          };
        })
        .catch(console.log);
    }
    // eslint-disable-next-line
  }, [tick, queryParams]);

  return {events, loading, setEvents};
};