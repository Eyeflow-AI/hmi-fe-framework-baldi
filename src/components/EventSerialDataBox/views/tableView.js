// React
import React, { useEffect, useState, useRef } from 'react';

// Design
import { CircularProgress, Typography, Box, CardMedia, IconButton, Tooltip } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';


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
          setAnnotatedImage(canvas.toDataURL("image/jpeg"));
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

  const hmiFilesWs = window.app_config?.hosts?.['hmi-files-ws']?.url ?? '';
  const [openDialog, setOpenDialog] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dataToUse, setDataToUse] = useState([]);
  const imagesURLSRef = useRef([]);
  const [imagesURLS, setImagesURLS] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState([]);
  const { _id: stationId } = GetSelectedStation();
  const stationsList = GetStationsList();



  const setImagesURLSRef = (newImagesURLS) => {
    imagesURLSRef.current = newImagesURLS;
    setImagesURLS(newImagesURLS);
  }
  const setAnnotatedImage = ({ index, url, notAnnotatedURL }) => {
    let _imagesURLS = [...imagesURLSRef.current];
    _imagesURLS[index] = {
      annotated: url,
      notAnnotated: notAnnotatedURL
    };
    setImagesURLSRef([..._imagesURLS]);
  }

  const drawImage = async ({ url, index, sizes, region }) => {
    const imageScale = region?.image_scale ?? 0.5;
    let bboxes = [];
    region?.tests?.forEach((test) => {
      bboxes = [...bboxes, ...test?.detections];
    })
    getAnnotatedImg({
      image: url
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

  const handleFeedback = ({ index, regionName, serialId }) => {
    console.log({ index, regionName, serialId })
    let _loadingFeedback = [...loadingFeedback];
    _loadingFeedback[index] = true;
    setLoadingFeedback([..._loadingFeedback]);
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

  const handleImagePath = ({ image }) => {
    setImagePath(image);
  }

  useEffect(() => {
    if (!openDialog) {
      setDialogTitle('');
      setImagePath('');
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
      };
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
            url: `${filesWSToUse}/eyeflow_data/event_image/${inspection?.image?.image_path ?? inspection?.image_path}/${inspection?.image?.image_file ?? inspection?.image_file}`,
            index,
            sizes: IMAGE_SIZES[checklist.length],
            region: inspection,
          });
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
            url: `${filesWSsToUse.length > 0 ? filesWSsToUse[index] : filesWSToUse}/eyeflow_data/event_image/${inspection?.image?.image_path ?? inspection?.image_path}/${inspection?.image?.image_file ?? inspection?.image_file}`,
            index,
            sizes: IMAGE_SIZES[checklist.length],
            region: inspection,
          });
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
  console.log({ inspections, dataToUse })

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
                  {!isSelectedSerialRunning && !inspection?.feedback && !loadingFeedback[index] && inspection?.image_path && inspection?.image_path &&
                    <Tooltip title={t('feedback')}>
                      <IconButton
                        onClick={() => handleFeedback({ index, regionName: inspection?.name, serialId })}
                      >
                        <FileUploadIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  {!isSelectedSerialRunning && !inspection?.feedback && loadingFeedback[index] && inspection?.image_path && inspection?.image_path &&
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '1rem',
                      }}
                    >
                      <CircularProgress
                        sx={{
                          color: colors.eyeflow.blue.medium,
                        }}
                      />
                    </Box>
                  }
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
                          handleImagePath({ image: imagesURLS?.[index]?.annotated });
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
      />
    </Box>
  )
}