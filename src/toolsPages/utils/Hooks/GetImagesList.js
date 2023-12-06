import { useState, useEffect } from "react";

import axios from "axios";

import Clock from "./Clock";

export default function GetImagesList({
  url,
  imageBaseURL,
  sleepTime = 30000,
} = {}) {
  const { clock } = Clock({ sleepTime });
  const [imagesList, setImagesList] = useState([]);
  const loadImagesList = () => {
    // axios({
    //   method: 'get',
    //   url,
    //   responseType: 'json',
    // })
    //   .then(response => {
    //     const requestData = response.data;
    //     const dataType = requestData?.type ?? 'edge_python';
    //     let imagesList = [];
    //     if (dataType === 'edge_python') {
    //       imagesList = requestData?.cameras_list ?? [];
    //     }
    //     else if (dataType === 'edge_c') {
    //       let inputs = Object.keys(requestData?.data ?? {});
    //       imagesList = inputs.map((input) => requestData.data[input]);
    //     };
    //     imagesList.forEach((imageData => {
    //       if (imageBaseURL.endsWith('/'))
    //         imageData.full_url = imageBaseURL.slice(0, -1) + imageData.url_path;
    //       else
    //         imageData.full_url = imageBaseURL + imageData.url_path;
    //     }));
    //     setImagesList(imagesList);
    //   })
    //   .catch(console)
    //   .finally(el => {
    //   })
  };

  useEffect(() => {
    if (url && imageBaseURL) {
      loadImagesList();
    }
    // eslint-disable-next-line
  }, [clock, url, imageBaseURL]);

  return { clock, loadImagesList, imagesList };
}
