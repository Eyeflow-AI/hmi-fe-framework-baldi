import {useState, useEffect} from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import fetchJson from '../utils/functions/fetchJson';
import RegionBox from '../toolsPages/ImagesAnalyser/RegionBox';

const styleSx = {
  mainBoxSx: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    // border: '1px solid green',
  },
  circularProgressSx: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-20px',
    marginLeft: '-20px',
  }
};
const imageStyle = {
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  opacity: '1',
};
const loadingImageStyle = {
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  filter: 'blur(5px)',
  opacity: '0.7',
};

export default function ImageCard ({imageData}) {
  const [imageLoading, setImageLoading] = useState(true);
  const [detectionsLoading, setDetectionsLoading] = useState(false);
  const loading = imageLoading || detectionsLoading;
  const [eventData, setEventData] = useState(null);
  const [detections, setDetections] = useState([]);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    setEventData(null);
    if (!imageData) {
      setImageLoading(false);
      return;
    }

    setImageLoading(true);
    if (imageData.image_data_url) {
      setDetectionsLoading(true);
      fetchJson(imageData.image_data_url)
        .then(data => {
          setEventData(data);
        })
        .catch(err => {
          console.error(err);
          setEventData(null);
          setDetectionsLoading(false);
        });
    }

  }, [imageData]);

  useEffect(() => {
    if (!eventData) {
      setDetections([]);
      return;
    }

    let newDetectionList = [];
    if (eventData.type === "checklist") {
      for (let [key, detections] of Object.entries(eventData.detections ?? {})) {
        for (let detection of detections) {
          newDetectionList.push({...detection, dataset_id: key});
        }
      }
    }

    setDetections(newDetectionList);
    setDetectionsLoading(false);
  }, [eventData]);

  const onImageLoad = (event) => {
    setImageWidth(event.target.naturalWidth);
    setImageHeight(event.target.naturalHeight);
    setImageLoading(false);
  }

  return (
    <Box id="image-card" sx={styleSx.mainBoxSx}>
      <img alt="" src={imageData?.image_url} style={loading? loadingImageStyle : imageStyle} onLoad={onImageLoad}/>
      {loading && <CircularProgress sx={styleSx.circularProgressSx} />}
      {detections.map((detection, index) => (
        <RegionBox data={detection} key={index} imageWidth={imageWidth} imageHeight={imageHeight}/>
      ))}
    </Box>
  )
}