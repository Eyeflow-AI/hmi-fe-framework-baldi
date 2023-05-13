import { useState, useEffect } from 'react';


import axios from 'axios';

import Clock from './Clock';


export default function GetImagesList({ url, sleepTime = 30000 } = {}) {

  const { clock } = Clock({ sleepTime });
  const [imagesList, setImagesList] = useState([]);

  const loadImagesList = () => {
    axios({
      method: 'get',
      url,
      responseType: 'json',
    })
      .then(response => {
        const data = response.data;
        const imagesList = data?.cameras_list ?? [];
        setImagesList(imagesList);
      })
      .catch(console)
      .finally(el => {
      })
  };

  useEffect(() => {
    loadImagesList();
    // eslint-disable-next-line
  }, [clock]);

  return { loadImagesList, imagesList };
};