import { useState, useEffect } from "react";

import API from "../../api";
import Clock from "./Clock";

import axios from "axios";

export default function GetRunningBatch({
  stationId,
  sleepTime = 3000,
  automaticUpdate = true,
} = {}) {
  const [data, setData] = useState({ batch: null });
  const [loading, setLoading] = useState(null);
  const { clock } = Clock({ sleepTime, automaticUpdate });
  const loadRunningBatch = () => {
    if (stationId) {
      API.get
        .runningBatch({ stationId }, setLoading)
        .then((response) => {
          let batch = response.batch;

          if (JSON.stringify(batch) !== JSON.stringify(data.batch)) {
            setData(response);
          } else {
            // console.log(`Running batch did not update`);
          }
        })
        .catch(console.log);
      // Client-side code
      // fetch("http://localhost:3000")
      //   .then((response) => {
      //     if (response.status === 304) {
      //       // Resource not modified, use cached version
      //       console.log("Resource not modified, using cached version");
      //       // return getCachedResource();
      //     } else {
      //       // Resource modified, update cache
      //       console.log("Resource modified, updating cache");
      //       // return response.json().then((data) => {
      //       //   // updateCachedResource(data);
      //       //   return data;
      //       // });
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching resource:", error);
      //   });
      // axios.get("http://localhost:3000").then((response) => {
      //   if (response.status === 304) {
      //     // Resource not modified, use cached version
      //     console.log("Resource not modified, using cached version");
      //     // return getCachedResource();
      //   } else {
      //     // Resource modified, update cache
      //     console.log("Resource modified, updating cache");
      //     // return response.json().then((data) => {
      //     //   // updateCachedResource(data);
      //     //   return data;
      //     // });
      //   }
      // });
    }
  };

  useEffect(() => {
    loadRunningBatch();
    // eslint-disable-next-line
  }, [clock, stationId]);

  return { runningBatch: data.batch, loading, loadRunningBatch };
}
