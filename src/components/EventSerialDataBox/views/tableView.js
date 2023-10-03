// React
import React, { useEffect, useState, useRef } from 'react';

// Design
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box/';
import CardMedia from '@mui/material/CardMedia';

// Internal
import ImageDialog from '../../ImageDialog';
import API from '../../../api';
import GetSelectedStation from '../../../utils/Hooks/GetSelectedStation';
import GetStationsList from '../../../utils/Hooks/GetStationsList';
import IPV6toIPv4 from '../../../utils/functions/ipv4Format';

// Third-party
import { useTranslation } from "react-i18next";
import { colors } from 'sdk-fe-eyeflow';

// const GRID_SIZES = {
//   1: 12,
//   2: 12,
//   3: 6,
//   4: 6,
//   5: 6,
//   6: 6,
// }

const IMAGE_SIZES = {
  1: '900px',
  2: '600px',
  3: '250px',
  4: '350px',
  5: '350px',
  6: '350px',
}

function expandCoordinates({ imgWidth, imgHeight, x_min, x_max, y_min, y_max, expandBox }) {

  if (expandBox) {
    let xc = (x_max + x_min) / 2;
    let halfWidth = (x_max - x_min) / 2;
    let yc = (y_max + y_min) / 2;
    let halfHeight = (y_max - y_min) / 2;

    x_min = Math.round(xc - (halfWidth * expandBox));
    if (x_min < 0) {
      x_min = 0;
    }
    x_max = Math.round(xc + (halfWidth * expandBox));
    if (x_max > imgWidth) {
      x_max = imgWidth;
    };
    y_min = Math.round(yc - (halfHeight * expandBox));
    if (y_min < 0) {
      y_min = 0;
    }
    y_max = Math.round(yc + (halfHeight * expandBox));
    if (y_max > imgHeight) {
      y_max = imgHeight;
    };
  };
  return [x_min, x_max, y_min, y_max];
};

const getAnnotatedImg = ({
  image
  , bbox
  , index
  , scale
  , setAnnotatedImage
  , bboxRegion = null
  , options = {
    severalAnnotations: false
    , returnCanvasURL: false
    , info: {}
  } }) => {
  let strokeStyle = options.strokeStyle || colors.eyeflow.green.dark;
  let expandBox = options.expandBox || 1;
  var img = new Image();
  img.src = image;
  img.crossOrigin = "anonymous";

  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const notAnnotatedCanvas = document.createElement('canvas');
    notAnnotatedCanvas.width = img.width;
    notAnnotatedCanvas.height = img.height;
    const notAnnotatedCtx = notAnnotatedCanvas.getContext('2d');
    notAnnotatedCtx.drawImage(img, 0, 0, img.width, img.height);

    if (bboxRegion) {
      // console.log({ bboxRegion })
      let [x_min, x_max, y_min, y_max] = expandCoordinates({
        imgWidth: img.width / scale,
        imgHeight: img.height / scale,
        x_min: bboxRegion?.x_min ?? bboxRegion?.bbox?.x_min,
        x_max: bboxRegion?.x_max ?? bboxRegion?.bbox?.x_max,
        y_min: bboxRegion?.y_min ?? bboxRegion?.bbox?.y_min,
        y_max: bboxRegion?.y_max ?? bboxRegion?.bbox?.y_max,
        expandBox
      });
      ctx.strokeStyle = bboxRegion?.color ?? colors.eyeflow.green.dark;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        parseInt(x_min * scale - 1),
        parseInt(y_min * scale + 1),
        parseInt((x_max - x_min) * scale),
        parseInt((y_max - y_min) * scale)
      );

      ctx.lineWidth = 3;
      ctx.strokeRect(
        parseInt(x_min * scale),
        parseInt(y_min * scale),
        parseInt((x_max - x_min) * scale),
        parseInt((y_max - y_min) * scale)
      );

    }
    if (options.severalAnnotations) {

      (Array.isArray(bbox) && bbox.length > 0 ? bbox : []).forEach((bb, i) => {
        // console.log({ bb })
        let [x_min, x_max, y_min, y_max] = expandCoordinates({
          imgWidth: img.width / scale,
          imgHeight: img.height / scale,
          x_min: bb?.x_min ?? bb?.bbox?.x_min,
          x_max: bb?.x_max ?? bb?.bbox?.x_max,
          y_min: bb?.y_min ?? bb?.bbox?.y_min,
          y_max: bb?.y_max ?? bb?.bbox?.y_max,
          expandBox
        });

        strokeStyle = bb?.color ?? colors.eyeflow.green.dark;
        ctx.strokeStyle = strokeStyle;
        // console.log({ strokeStyle })
        ctx.lineWidth = 3;
        ctx.strokeRect(
          parseInt(x_min * scale - 1),
          parseInt(y_min * scale + 1),
          parseInt((x_max - x_min) * scale),
          parseInt((y_max - y_min) * scale)
        );

        ctx.lineWidth = 3;
        ctx.strokeRect(
          parseInt(x_min * scale),
          parseInt(y_min * scale),
          parseInt((x_max - x_min) * scale),
          parseInt((y_max - y_min) * scale)
        );

        ctx.font = '30px Arial';

        ctx.fillStyle = 'white';
        ctx.fillText(
          `${bb?.item} - ${i + 1}`
          , parseInt(x_min * scale - 3)
          , parseInt(y_min * scale - 12)
        )
        ctx.fillStyle = strokeStyle;
        ctx.fillText(
          `${bb?.item} - ${i + 1}`
          , parseInt(x_min * scale - 2)
          , parseInt(y_min * scale - 10)
        );
      })
      if (options?.returnCanvasURL) {
        let canvasURL = canvas.toDataURL("image/jpeg");
        return canvasURL;
      }
      else {
        if (options?.camera) {
          setAnnotatedImage(options.camera, canvas.toDataURL("image/jpeg"));
        }
        else {
          setAnnotatedImage({ index, url: canvas.toDataURL("image/jpeg"), notAnnotatedURL: notAnnotatedCanvas.toDataURL("image/jpeg") });

        }
      }

    }
    else {
      let [x_min, x_max, y_min, y_max] = expandCoordinates(
        img.width / scale,
        img.height / scale,
        bbox.x_min,
        bbox.x_max,
        bbox.y_min,
        bbox.y_max,
        expandBox
      );
      strokeStyle = bbox?.color ?? colors.eyeflow.green.dark;
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        parseInt(x_min * scale - 1),
        parseInt(y_min * scale + 1),
        parseInt((x_max - x_min) * scale),
        parseInt((y_max - y_min) * scale)
      );

      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        parseInt(x_min * scale),
        parseInt(y_min * scale),
        parseInt((x_max - x_min) * scale),
        parseInt((y_max - y_min) * scale)
      );
      if (options?.returnCanvasURL) {
        let canvasURL = canvas.toDataURL("image/jpeg");
        return canvasURL;
      }
      else {
        if (options?.camera) {
          setAnnotatedImage(options.camera, canvas.toDataURL("image/jpeg"));
        }
        else {
          // setAnnotatedImage(canvas.toDataURL("image/jpeg"));
          setAnnotatedImage({ index, url: canvas.toDataURL("image/jpeg"), notAnnotatedURL: notAnnotatedCanvas.toDataURL("image/jpeg") });
        }
      }
    }


  };
};



export default function TableView({
  loading
  , inspections
  , config
  , appBarHeight
  , isSelectedSerialRunning
  , serialId
}) {

  const { t } = useTranslation();

  console.log({
    loading
    , inspections
    , config
    , appBarHeight
    , isSelectedSerialRunning
    , serialId
  })

  const hmiFilesWs = window.app_config?.hosts?.['hmi-files-ws']?.url ?? '';
  const [openDialog, setOpenDialog] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [otherImages, setOtherImages] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dataToUse, setDataToUse] = useState([]);
  const imagesURLSRef = useRef([]);
  const [imagesURLS, setImagesURLS] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState([]);
  const { _id: stationId } = GetSelectedStation();
  const stationsList = GetStationsList();
  const [feedbackInfo, setFeedbackInfo] = useState({});

  // console.log({feedbackInfo})

  const setImagesURLSRef = (newImagesURLS) => {
    imagesURLSRef.current = newImagesURLS;
    setImagesURLS(newImagesURLS);
  }
  const setAnnotatedImage = ({ index, url, notAnnotatedURL }) => {
    let _imagesURLS = [...imagesURLSRef.current];
    _imagesURLS[index] = {
      annotated: url,
      notAnnotated: notAnnotatedURL,
    };
    setImagesURLSRef([..._imagesURLS]);
  }

  const drawImage = async ({ url, index, sizes, region, isSelectedSerialRunning=false }) => {
    const imageScale = region?.image?.image_scale ?? 1;
    let bboxes = [];
    region?.tests?.forEach((test) => {
      // console.log({bboxes, region})
      bboxes = [...bboxes, ...test?.detections?.filter(detection => detection?.image?.image_file === region?.image?.image_file || detection?.image_file === region?.image_file) ?? []];
    });
    let absolute_path = '';
    let _url = '';
    if (isSelectedSerialRunning) {
      absolute_path = region?.image?.stage_image_path;
    }
    else {
      absolute_path = region?.image?.absolute_image_path;
    }
    if (absolute_path) {
      absolute_path = absolute_path.replace('/opt/eyeflow/data', 'eyeflow_data');
      _url = `${url}/${absolute_path}/${region?.image?.image_file ?? region?.image_file}`;
    }
    else {
      _url = `${url}/eyeflow_data/event_image/${region?.image?.image_path ?? region?.image_path}/${region?.image?.image_file ?? region?.image_file}`;
    }
    console.log({_url, isSelectedSerialRunning, region, name: region.region, absolute_path, bboxes})
    getAnnotatedImg({
      // image: `${url}/${region?.image?.image_path ?? region?.image_path}/${region?.image?.image_file ?? region?.image_file}`
      image: `${_url}`
      , bboxRegion: region?.bbox
      , bbox: bboxes
      , scale: imageScale
      , index
      , setAnnotatedImage
      , options: {
        severalAnnotations: true,
        returnCanvasURL: false
      }
    })
  };

  const handleFeedback = ({ index, regionName, serialId, obj=null}) => {
    
    let _loadingFeedback = [...loadingFeedback];
    _loadingFeedback[index] = true;
    setLoadingFeedback([..._loadingFeedback]);
    if (obj) {
      // console.log({index, regionName, serialId, obj})
      let imageId = obj?.originalUrl?.split('/')?.pop()?.replace('.jpg', '');
      let info = {
        index,
        regionName,
        serialId,
        url: obj?.originalUrl,
        imageId,
      }

      API.put.feedbackOtherImages({
        info,
        stationId,
        serialId
      })
        .then((res) => { })
        .catch(console.log).finally(() => {
          _loadingFeedback[index] = false;
          setLoadingFeedback([..._loadingFeedback]);
        })
    }
    else {
      API.put.feedbackSerial({
        serialId
        , regionName
        , stationId
      })
        .then((res) => { })
        .catch(console.log).finally(() => {
          _loadingFeedback[index] = false;
          setLoadingFeedback([..._loadingFeedback]);
        })
    }

  }

  const handleImagePath = ({ image, otherImages = null, feedback, index, name}) => {
    setImagePath(image);
    if (otherImages) {
      setOtherImages(otherImages)
    }
    let info = {
      feedback: feedback,
      index: index,
      name: name,
    }
    setFeedbackInfo(info);
  }

  useEffect(() => {
    if (!openDialog) {
      setDialogTitle('');
      setImagePath('');
      setOtherImages(null);
      setFeedbackInfo({});
    }
  }, [openDialog]);

  useEffect(() => {
    let filesWSToUse = hmiFilesWs;

    let station = stationsList?.find((station) => station?._id === stationId);

    if (inspections.length === 1) {
      let checklist = inspections[0]?.event_data?.inspection_result?.check_list?.region;
      if (isSelectedSerialRunning) {
        let edge = station?.edges?.find((edge) => edge?.host === `http://${IPV6toIPv4(inspections?.[0]?.host)}`);
        let url = `${edge?.host}:${edge?.filesPort}`;
        filesWSToUse = url;
        // console.log({edge, url, inspection: inspections[0], station})
      };
      // console.log({filesWSToUse})
      const _imagesURLS = [];
      const _loadingFeedback = [];
      checklist.forEach((inspection, index) => {
        _imagesURLS.push({
          annotated: imagesURLS?.[index]?.annotated ?? '',
          notAnnotated: imagesURLS?.[index]?.notAnnotated ?? '',
        });
        _loadingFeedback.push(false);
      });
      setImagesURLSRef(_imagesURLS);
      checklist.forEach((inspection, index) => {
        checklist[index].tests.forEach((test, i) => {
          checklist[index].tests[i].order = test?.result ? 1 : 0;
        });
        checklist[index].tests.sort((a, b) => {
          return a.order - b.order;
        });
        if (JSON.stringify(inspection) !== JSON.stringify(dataToUse[index])) {
          drawImage({
            url: `${filesWSToUse}`,
            index,
            sizes: IMAGE_SIZES[checklist.length],
            region: inspection,
            isSelectedSerialRunning
          });
          let otherImages = {};
          inspection?.tests?.forEach((test) => {
            test?.detections?.forEach((detection) => {
              if (detection?.image?.image_file !== inspection?.image?.image_file) {
                if (!Object.keys(otherImages).includes(detection?.image?.image_file)) {
                  let absolute_path = '';
                  let url = '';
                  if (isSelectedSerialRunning) {
                    absolute_path = detection?.image?.stage_image_path;
                  }
                  else {
                    absolute_path = detection?.image?.absolute_image_path;
                  }
                  if (absolute_path) {
                    absolute_path = absolute_path.replace('/opt/eyeflow/data', 'eyeflow_data');
                    url = `${filesWSToUse}/${absolute_path}/${detection?.image?.image_file ?? detection?.image_file}`;
                  }
                  else {
                    url = `${filesWSToUse}/eyeflow_data/event_image/${detection?.image?.image_path ?? detection?.image_path}/${detection?.image?.image_file ?? detection?.image_file}`;
                  }
                  
                  otherImages[detection?.image?.image_file] = {
                    bboxes: [],
                    url,
                    annotate: true
                  }
                }
                otherImages[detection?.image?.image_file].bboxes.push(detection);
              }
            })
          })
          checklist[index].otherImages = otherImages;
        }
      });
      if (JSON.stringify(dataToUse) !== JSON.stringify(checklist)) {
        setDataToUse(checklist);
      };
    }
    else if (inspections.length > 1) {
      let checklist = inspections.map((inspection) => {
        return inspection?.event_data?.inspection_result?.check_list?.region;
      });
      const _imagesURLS = [];
      const _loadingFeedback = [];
      checklist = checklist.flat();

      let filesWSsToUse = [];
      if (isSelectedSerialRunning) {
        filesWSsToUse = inspections.map((inspection) => {
          let edge = station?.edges?.find((edge) => edge?.host === `http://${IPV6toIPv4(inspection?.host)}`);
          let url = `${edge?.host}:${edge?.filesPort}`;
          return url;
        });
      };
      checklist.forEach((inspection, index) => {
        _imagesURLS.push({
          annotated: imagesURLSRef.current[index]?.annotated ?? '',
          notAnnotated: imagesURLSRef.current[index]?.notAnnotated ?? '',
        });
      })
      setImagesURLSRef(_imagesURLS);
      checklist.forEach((inspection, index) => {
        checklist[index].tests.forEach((test, i) => {
          checklist[index].tests[i].order = test?.result ? 1 : 0;
        })
        checklist[index].tests.sort((a, b) => {
          return a.order - b.order;
        });
        if (JSON.stringify(inspection) !== JSON.stringify(dataToUse[index])) {
          drawImage({
            url: `${filesWSsToUse.length > 0 ? filesWSsToUse[index] : filesWSToUse}`,
            index,
            sizes: IMAGE_SIZES[checklist.length],
            region: inspection,
            isSelectedSerialRunning
          });
          let otherImages = {};
          inspection?.tests?.forEach((test) => {
            test?.detections?.forEach((detection) => {
              if (detection?.image?.image_file !== inspection?.image?.image_file) {
                if (!Object.keys(otherImages).includes(detection?.image?.image_file)) {
                  let absolute_path = '';
                  let url = '';
                  if (isSelectedSerialRunning) {
                    absolute_path = detection?.image?.stage_image_path;
                  }
                  else {
                    absolute_path = detection?.image?.absolute_image_path;
                  }
                  if (absolute_path) {
                    absolute_path = absolute_path.replace('/opt/eyeflow/data', 'eyeflow_data');
                    url = `${filesWSToUse}/${detection?.image?.image_file ?? detection?.image_file}`;
                  }
                  else {
                    url = `${filesWSToUse}/eyeflow_data/event_image/${detection?.image?.image_path ?? detection?.image_path}/${detection?.image?.image_file ?? detection?.image_file}`;
                  }
                  // url: `${filesWSToUse}/eyeflow_data/event_image/${detection?.image?.image_path ?? detection?.image_path}/${detection?.image?.image_file ?? detection?.image_file}`,
                  otherImages[detection?.image?.image_file] = {
                    bboxes: [],
                    url,
                    annotate: true
                  }
                }
                otherImages[detection?.image?.image_file].bboxes.push(detection);
              }
            })
          })
          checklist[index].otherImages = otherImages;
        };
        _loadingFeedback.push(false);
      });

      if (JSON.stringify(dataToUse) !== JSON.stringify(checklist)) {
        setDataToUse(checklist);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspections]);

  useEffect(() => {
    return () => {
      imagesURLSRef.current.forEach((imageURL) => {
        URL.revokeObjectURL(imageURL);
      })
      setImagesURLSRef([]);
    }
  }, []);

  const HEIGHT = [1, 1, 1, 2, 2, 2];
  const WIDTH = [1, 2, 3, 3, 3, 3];

  const isThereClasses = (inspection) => {
    let isThere = false;
    inspection?.tests?.forEach((test) => {
      test?.detections?.forEach((detection) => {
        if (detection?.classes?.length > 0) {
          isThere = true;
        }
      })
    })
    return isThere;
  }

  return (
    <Box
      width={config.width}
      height='100%'
      // height='100%'
      // direction="column"
      sx={{
        flexWrap: 'wrap',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
      id="table_view"
    >
      {
        !loading && dataToUse.length > 0 ?
          dataToUse.map((inspection, index) => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: `calc(100% / ${HEIGHT[dataToUse.length - 1]})`,
                width: `calc(100% / ${WIDTH[dataToUse.length - 1]})`,
                flexDirection: 'column',
                backgroundColor: inspection?.result ? `${colors.statuses['ok']}50` : `${colors.statuses['ng']}50`,
                border: `.02rem solid ${colors.eyeflow.blue.medium}`,
                flexGrow: 1,
                overflow: 'hidden',
              }}
              key={`${index}-table-view`}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '20%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography textAlign={'center'} textTransform={'uppercase'}>
                    {inspection?.name}
                    &nbsp;&nbsp;
                    <span
                      style={{
                        color: inspection?.result ? colors.green : colors.red,
                        fontWeight: 'bold',
                      }}
                    >
                      {inspection.result ? t('OK') : t('NG')}
                    </span>
                  </Typography>
                </Box>
                {
                  imagesURLS?.[index]?.notAnnotated ?
                    <Box
                      sx={{
                        width: '100%',
                        height: '80%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '.5rem',
                        color: "black"
                      }}
                    >
                      <CardMedia
                        component="img"
                        src={imagesURLS?.[index].notAnnotated}
                        style={{
                          height: '100%',
                          display: 'block',
                          margin: 'auto',
                          objectFit: 'contain',
                          paddingBottom: '.5rem',
                          cursor: 'pointer',
                        }}
                        alt="Inspection"
                        onClick={() => {
                          setDialogTitle(inspection?.name ?? '');
                          handleImagePath({ 
                            image: imagesURLS?.[index]?.annotated, 
                            otherImages: inspection?.otherImages,
                            feedback: Boolean(inspection?.feedback),
                            index: index,
                            name: inspection?.name,
                          });
                          setOpenDialog(true);
                        }}
                      />
                    </Box>
                    :
                    <Box
                      sx={{
                        width: '100%',
                        height: '80%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.eyeflow.blue.light,
                        border: `.02rem solid ${colors.eyeflow.blue.medium}`,
                        borderRadius: '.5rem',
                        color: "black"
                      }}
                    >
                      <Typography textAlign={'center'} textTransform={'uppercase'}>
                        {t('no_image')}
                      </Typography>
                    </Box>
                }
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: `50%`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  border: `.02rem solid black`,
                  bgcolor: 'background.paper',
                  borderRadius: '.5rem',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <Box
                    sx={{
                      width: isThereClasses(inspection) ? '33%' : '50%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <Typography textAlign={'center'} textTransform={'uppercase'} variant="caption">
                      {t('element')}
                    </Typography>
                  </Box>
                  {
                    isThereClasses(inspection) &&
                    <Box
                      sx={{
                        width: isThereClasses(inspection) ? '33%' : '50%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <Typography textAlign={'center'} textTransform={'uppercase'} variant="caption">
                        {t('classes')}
                      </Typography>
                    </Box>
                  }
                  <Box
                    sx={{
                      width: isThereClasses(inspection) ? '33%' : '50%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <Typography textAlign={'center'} textTransform={'uppercase'} variant="caption">
                      {t('detected')} / {t('predicted')}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: `calc(100% - 20px)`,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  {inspection?.tests.map((row, i) => (
                    <Box
                      key={`${i}-tests-table`}
                      sx={{
                        height: '100%',
                        maxHeight: '60px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: row?.result ? `${colors.statuses['ok']}70` : `${colors.statuses['ng']}70`,
                        padding: '.2rem',
                        margin: '.1rem',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: isThereClasses(inspection) ? '33%' : '50%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography textAlign={'center'} textTransform={'uppercase'} variant="caption">
                          {row?.name}
                        </Typography>
                      </Box>
                      {
                        isThereClasses(inspection) &&
                        <Box
                          sx={{
                            height: '100%',
                            width: isThereClasses(inspection) ? '33%' : '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          {row?.detections?.map((detection, i) => {
                            let classes = detection?.classes?.map((c) => c?.class).join(', ');
                            return (
                              <Typography textAlign={'center'} textTransform={'uppercase'} variant="caption" fontWeight={'bold'}>
                                {classes}
                              </Typography>
                            )
                          })}
                          {
                            row?.detections?.length === 0 &&
                            <Typography textAlign={'center'} textTransform={'uppercase'} variant="caption" fontWeight={'bold'}>
                              {row?.function_parms?.subclass ?? t('no_class')}
                            </Typography>
                          }
                        </Box>
                      }
                      <Box
                        sx={{
                          height: '100%',
                          width: isThereClasses(inspection) ? '33%' : '50%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography textAlign={'center'} textTransform={'uppercase'} variant="caption">
                          {(row?.detections ?? []).length} /  {row?.function_parms?.count ?? 0}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ))
          :
          (
            loading &&
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress
                sx={{
                  color: 'white',
                }}
                size='10rem'
              />
            </Box>
          )
      }
      

      <ImageDialog
        open={openDialog}
        setOpen={setOpenDialog}
        imagePath={imagePath}
        title={dialogTitle}
        otherImages={otherImages}
        feedbackLoading={loadingFeedback[feedbackInfo?.index]}
        feedbackFunction={handleFeedback}
        hasFeedback={!isSelectedSerialRunning && !dataToUse?.find(el => el.name === feedbackInfo.name)?.feedback}
        feedbackObj={{
          feedbackInfo: feedbackInfo,
          regionName: dataToUse?.[feedbackInfo?.index]?.name,
          serialId: serialId,
        }}
      />
    </Box>
  )
}