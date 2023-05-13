import {useState, useEffect} from 'react';


function getClockValue () {
  return (new Date().toISOString());
};

export default function Clock({sleepTime=30000}={}) {

  const [tick, setTick] = useState(0);
  const [clock, setClock] = useState(getClockValue());
  
  useEffect(() => {
    const interval = setInterval(() => setTick((oldValue) => oldValue + 1), sleepTime);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (tick > 0) {
      setClock(getClockValue());
    };
  }, [tick]);
  
  return {clock};
};