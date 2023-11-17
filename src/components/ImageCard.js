import {useState, useEffect} from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Box';
import Box from '@mui/material/Box';

import fetchJson from '../utils/functions/fetchJson';
import DetectionBox from './DetectionBox';

const styleSx = {
  mainBoxSx: {
    display: 'flex',
    flexDirection: 'column',
    // width: '100%',
    // border: '1px solid red',
  },
  imageBoxSx: {
    position: 'relative',
    // width: '100%',
    // height: 'auto',
    // display: 'inline-block',
    // border: '1px solid green',
  },
  headerBoxSx: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 1,
    paddingRight: 1,
    borderRadius: '4px 4px 0 0',
  },
  textDate: {
    fontSize: '0.8rem',
    // color: 'text.secondary',
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
  display: 'block'
};

const loadingImageStyle = Object.assign({}, imageStyle, {
  filter: 'blur(2px)',
  opacity: '0.7',
});

export default function ImageCard ({title, eventTime, imageData, color, height, width}) {
  const [imageLoading, setImageLoading] = useState(true);
  const [detectionsLoading, setDetectionsLoading] = useState(false);
  const loading = imageLoading || detectionsLoading;
  const [eventData, setEventData] = useState(null);
  const [detections, setDetections] = useState([]);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const imageDataURL = imageData?.image_data_url;
  const imageSrc = imageData?.image_url;

  useEffect(() => {
    if (!imageSrc) {
      setImageLoading(false);
      return;
    }
    setImageLoading(true);
  }, [imageSrc]);

  useEffect(() => {
    if (imageDataURL) {
      setDetectionsLoading(true);
      fetchJson(imageDataURL)
        .then(data => {
          setEventData(data);
        })
        .catch(err => {
          console.error(err);
          setEventData(null);
          setDetectionsLoading(false);
        });
    }
    else {
      setEventData(null);
    }
  }, [imageDataURL]);

  useEffect(() => {
    if (!eventData) {
      setDetections([]);
      setDetectionsLoading(false);
      return;
    }

    let newDetectionList = [];
    if (eventData.type === "checklist") {
      // for (let [key, detections] of (eventData.detections ?? [])) {
        // console.log({eventData, x: Object.entries(eventData.detections ?? {}), imageDataURL})
        // console.log({detections, eventData})

        for (let detection of eventData.detections) {
          // console.log({detection, imageDataURL})
          newDetectionList.push({...detection});
        }
      // }
    }

    setDetections(newDetectionList);
    setDetectionsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData]);

  const onImageLoad = (event) => {
    setImageWidth(event.target.naturalWidth);
    setImageHeight(event.target.naturalHeight);
    setImageLoading(false);
  }


  return (
    <Box sx={styleSx.mainBoxSx} width={width} height={height}>
      <Box id="header-box" sx={styleSx.headerBoxSx} bgcolor={color ?? "primary.main"}>
        <Typography>
          {title}
        </Typography>
        <Typography sx={styleSx.textDate}>
          {eventTime}
        </Typography>
      </Box>
      <Box id="image-card" sx={styleSx.imageBoxSx}>
        <img alt="" src={imageSrc} style={loading? loadingImageStyle : imageStyle} onLoad={onImageLoad}/>
        {loading && <CircularProgress sx={styleSx.circularProgressSx} />}
        {!loading && detections.map((detection, index) => (
          <DetectionBox data={detection} key={index} imageWidth={imageWidth} imageHeight={imageHeight} showLabel={false} showConfidence={false}/>
        ))}
      </Box>
    </Box>
  )
}