import { useState, useEffect } from "react";

import API from "../../api";
import Clock from "./Clock";

function getType(obj) {
  if (obj instanceof Date) {
    return "date";
  }
  if (obj === null) {
    return "null";
  }
  if (obj === undefined) {
    return "undefined";
  }
  if (Array.isArray(obj)) {
    return "array";
  }

  if (Number.isNaN(obj)) {
    return "NaN";
  }

  if (typeof obj === "number") {
    if (Number.isInteger(obj)) {
      return "integer";
    }
    return "float";
  }
  return typeof obj;
}

function putTypeInObjcts(obj) {
  // read the type of the object and return a new object with the type

  let newObj = {};
  for (let key in obj) {
    newObj[key] = { type: getType(obj[key]), value: obj[key] };
  }
  return newObj;
}

export default function GetComponentData({
  component,
  query,
  stationId,
  sleepTime = 30000,
  run,
} = {}) {
  console.log({ stationId, sleepTime, run, query, component });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(null);
  const { clock } = Clock({ sleepTime });

  const loadResponse = () => {
    if (run) {
      // let dataToSend = JSON.parse(data);
      let dataToSend = putTypeInObjcts(query);
      API.get
        .componentData(
          { query: JSON.stringify(dataToSend), component, stationId },
          setLoading
        )
        .then((response) => {
          let data = response?.result;
          setResponse(data);
        })
        .catch(console.log);
    }
  };

  useEffect(() => {
    loadResponse();
    // eslint-disable-next-line
  }, [clock, stationId]);

  return { response, loading, loadResponse };
}
