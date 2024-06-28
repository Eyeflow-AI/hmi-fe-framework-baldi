import { useState, useEffect } from "react";

import axios from "axios";

export default function GetImagesList({
  url,
  imageBaseURL,
  mulpitleEdges,
  edges
} = {}) {
  const [imagesList, setImagesList] = useState([]);
  const loadImagesList = async () => {
    if (!url && !imageBaseURL && !edges) return;
    let allImages = []
    if (mulpitleEdges && edges.length > 0) {
      const requests = edges.map((edge) => {
        let imageBaseURL = edge.url;
        return axios.get(`${imageBaseURL}/inputs`)
          .then((response) => {
            const requestData = response.data;
            const dataType = requestData?.type ?? "edge_python";
            let imagesList = [];
            if (dataType === "edge_python") {
              imagesList = requestData?.cameras_list ?? [];
            } else if (dataType === "edge_c") {
              let inputs = Object.keys(requestData?.data ?? {});
              imagesList = inputs.map((input) => requestData.data[input]);
            }
            imagesList.forEach((imageData) => {
              if (imageBaseURL.endsWith("/")) {
                imageData.full_url = imageBaseURL.slice(0, -1) + imageData.url_path;
              } else {
                imageData.full_url = imageBaseURL + imageData.url_path;
              }
            });
            return imagesList;
          })
          .catch(console.error);
      });

      const results = await Promise.all(requests);
      allImages = results.flat();
      setImagesList(allImages);
    } else {
      axios.get(url)
        .then((response) => {
          const requestData = response.data;
          const dataType = requestData?.type ?? "edge_python";
          let imagesList = [];
          if (dataType === "edge_python") {
            imagesList = requestData?.cameras_list ?? [];
          } else if (dataType === "edge_c") {
            let inputs = Object.keys(requestData?.data ?? {});
            imagesList = inputs.map((input) => requestData.data[input]);
          }
          imagesList.forEach((imageData) => {
            if (imageBaseURL.endsWith("/"))
              imageData.full_url = imageBaseURL.slice(0, -1) + imageData.url_path;
            else imageData.full_url = imageBaseURL + imageData.url_path;
          });
          setImagesList(imagesList);
        })
        .catch(console)
        .finally((el) => { });
    }
  };

  useEffect(() => {
    if ((url && imageBaseURL) || edges) {
      loadImagesList();
    }
    // eslint-disable-next-line
  }, [url, imageBaseURL, edges]);

  return { loadImagesList, imagesList };
}
