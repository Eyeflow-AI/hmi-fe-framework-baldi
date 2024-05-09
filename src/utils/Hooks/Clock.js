import { useState, useEffect, useRef } from "react";

function getClockValue() {
  return new Date().toISOString();
}

export default function Clock({
  sleepTime = 30000,
  automaticUpdate = true,
} = {}) {
  const [tick, setTick] = useState(0);
  const [clock, setClock] = useState(getClockValue());
  const automaticUpdateRef = useRef(automaticUpdate);

  // console.log({automaticUpdate})
  useEffect(() => {
    const interval = setInterval(() => {
      if (!automaticUpdateRef.current) {
        return 0;
      } else {
        return setTick((oldValue) => oldValue + 1);
      }
    }, sleepTime);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // console.log({ memoazation: clock });

  useEffect(() => {
    if (tick > 0 && automaticUpdate) {
      let newValue = getClockValue();
      console.log({ memo3: newValue !== clock });
      setClock(newValue);
    }
    if (!automaticUpdate) {
      setClock("");
    }
    // eslint-disable-next-line
  }, [tick, automaticUpdate]);

  return { clock };
}
