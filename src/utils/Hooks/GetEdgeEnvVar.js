import { useState, useEffect } from 'react';


import axios from 'axios';

import Clock from './Clock';


export default function GetEdgeEnvVar({ url, sleepTime = 30000 } = {}) {

  const { clock } = Clock({ sleepTime });
  const [envVar, setEnvVar] = useState(null);

  const updateData = () => {
    axios({
      method: 'get',
      url,
      responseType: 'json',
    })
      .then(response => {
        const requestData = response.data;
        if (!requestData.hasOwnProperty('env_var')) {
          throw new Error('Invalid response data');
        };

        const newEnvVar = requestData.env_var;
        // check if obj is empty
        if (Object.keys(newEnvVar).length === 0) {
          setEnvVar(null);
        }
        else if (JSON.stringify(newEnvVar) !== JSON.stringify(envVar)) {
          setEnvVar(newEnvVar);
        }
      })
      .catch(console.error)
    //   .finally(el => {
    //   })
  };

  useEffect(() => {
    if (url) {
      updateData();
    }
    else {
      setEnvVar(null);
    };
    // eslint-disable-next-line
  }, [clock, url]);

  return { clock, updateData, envVar };
};