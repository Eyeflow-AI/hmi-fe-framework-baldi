import {useState, useEffect, useRef} from 'react';


function getClockValue () {
  return (new Date().toISOString());
};

export default function Clock({sleepTime=30000, automaticUpdate = true}={}) {

  const [tick, setTick] = useState(0);
  const [clock, setClock] = useState(getClockValue());
  const automaticUpdateRef = useRef(automaticUpdate);
  
  // console.log({automaticUpdate})
  useEffect(() => {
    const interval = setInterval(() => {
      if (!automaticUpdateRef.current)  {
        return 0
      }
      else {
        return setTick((oldValue) => oldValue + 1)
      }
    }, sleepTime);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (tick > 0 && automaticUpdate) {
      setClock(getClockValue());
    };
    if (!automaticUpdate) {
      setClock('')
    }
  }, [tick, automaticUpdate]);

  
  return {clock};
};