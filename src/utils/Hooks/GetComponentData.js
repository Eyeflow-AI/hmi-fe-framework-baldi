import { useState, useEffect } from "react";

import Clock from "./Clock";
import getComponentData from "../functions/getComponentData";

export default function GetComponentData({
  component,
  query,
  stationId,
  sleepTime = 30000,
  run,
} = {}) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(null);

  const { clock } = Clock({ sleepTime });

  const loadResponse = () => {
    if (run) {
      getComponentData({
        query,
        component,
        stationId,
        setLoading,
        setResponse,
      });
    }
  };

  useEffect(() => {
    loadResponse();
    // eslint-disable-next-line
  }, [clock, stationId]);

  return { response, loading, loadResponse };
}
