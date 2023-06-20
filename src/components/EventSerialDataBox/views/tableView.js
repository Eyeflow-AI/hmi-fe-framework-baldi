// React
import React, { useEffect, useState, useRef } from 'react';

// Design
import { CircularProgress, Grid, Typography, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// Internal
import ImageDialog from '../../ImageDialog';

// Third-party
import { useTranslation } from "react-i18next";
import { colors } from 'sdk-fe-eyeflow';

const GRID_SIZES = {
  1: 12,
  2: 12,
  3: 6,
  4: 6,
  5: 6,
  6: 6,
}

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
          setAnnotatedImage({ index, url: canvas.toDataURL("image/jpeg") });

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
          setAnnotatedImage({ index, url: canvas.toDataURL("image/jpeg") });
        }
      }
    }


  };
};



export default function TableView({
  loading
  , inspections
  , config
}) {

  const { t } = useTranslation();


  const hmiFilesWs = window.app_config?.hosts?.['hmi-files-ws']?.url ?? '';
  const [openDialog, setOpenDialog] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dataToUse, setDataToUse] = useState([]);
  const imagesURLSRef = useRef([]);
  const [imagesURLS, setImagesURLS] = useState([]);

  const setImagesURLSRef = (newImagesURLS) => {
    imagesURLSRef.current = newImagesURLS;
    setImagesURLS(newImagesURLS);
  }
  const setAnnotatedImage = ({ index, url }) => {
    let _imagesURLS = [...imagesURLSRef.current];
    _imagesURLS[index] = url;
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
    }
    )
  };

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
    if (inspections.length === 1) {
      let checklist = inspections[0]?.event_data?.inspection_result?.check_list?.region;
      let _classesHeaderFlag = false;
      const _imagesURLS = [];
      checklist.forEach((inspection, index) => {
        _imagesURLS.push('');
      })
      setImagesURLSRef(_imagesURLS);
      checklist.forEach((inspection, index) => {
        console.log({ inspection })
        // setImagesURLS({ ...imagesURLS, [String(index)]: '' });
        // let detections = inspection?.tests?.detections;
        drawImage({
          url: `${hmiFilesWs}/eyeflow_data/event_image/${inspection?.image_path}/${inspection?.image_file}`,
          index,
          sizes: IMAGE_SIZES[checklist.length],
          region: inspection,
        });
        // console.log({ imageURL })
        // _imagesURLS.push(imageURL);
      })
      setDataToUse(checklist);
      // console.log({ _imagesURLS })
      // setImagesURLS(_imagesURLS);
    }
    else if (inspections.length > 1) {

    }
  }, [inspections]);

  useEffect(() => {
    return () => {
      imagesURLSRef.current.forEach((imageURL) => {
        URL.revokeObjectURL(imageURL);
      })
      setImagesURLSRef([]);
    }
  }, []);

  console.log({ title: 'table_view', dataToUse, imagesURLS })

  return (
    <Grid
      container
      height='100%'
      spacing={1}
      direction="column"
      justifyContent="center"
      alignItems="space-evenly"
    >
      {
        !loading && dataToUse.length > 0 ?
          dataToUse.map((inspection, index) => (
            <Grid
              item
              key={index}
              xs={GRID_SIZES[dataToUse.length]}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                // height: '100%',
                backgroundColor: inspection?.result ? `${colors.statuses['ok']}50` : `${colors.statuses['ng']}50`,
                // opacity: 0.8,
                border: `.02rem solid ${colors.eyeflow.blue.medium}`,
              }}
            >

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  padding: '.5rem',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    // height: IMAGE_SIZES[dataToUse.length],
                    display: 'flex',
                    // height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
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
                  {
                    imagesURLS?.[index] ?
                      <img
                        // src="/assets/cat.webp"
                        // src={`${hmiFilesWs}/eyeflow_data/event_image/${inspection?.image_path}/${inspection?.image_file}`}
                        src={imagesURLS?.[index]}
                        // src={noImageBlob}
                        style={{
                          // width: "calc(2560px * 0.15)",
                          width: IMAGE_SIZES[dataToUse.length],
                          // width: '100%',
                          // height: '100%',
                          display: 'block',
                          margin: 'auto',
                          objectFit: 'contain',
                          paddingBottom: '.5rem',
                          cursor: 'pointer',
                        }}
                        alt="Inspection"
                        onClick={() => {
                          setDialogTitle(inspection?.name ?? '');
                          handleImagePath({ image: imagesURLS?.[index] });
                          setOpenDialog(true);
                        }}
                      />
                      :

                      <Box
                        sx={{
                          width: '100%',
                          height: '150px',
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
                    height: dataToUse.length > 1 ? `calc(100% - 256px - ${IMAGE_SIZES[dataToUse.length]})` : `calc(100% - 128px - ${IMAGE_SIZES[dataToUse.length]})`,
                    display: 'block',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="info table">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('element')}</TableCell>
                          {
                            inspection?.tests?.[0]?.detections?.[0]?.classes?.length > 0 &&
                            <TableCell align="right">{t('classes')}</TableCell>
                          }
                          <TableCell align="right">{t('predicted')}</TableCell>
                          <TableCell align="right">{t('detected')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inspection?.tests.map((row, i) => (
                          <TableRow
                            key={`${i}-tests-table`}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                              backgroundColor: row?.result ? `${colors.statuses['ok']}70` : `${colors.statuses['ng']}70`,
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row?.name}
                            </TableCell>
                            {
                              inspection?.tests?.[0]?.detections?.[0]?.classes?.length > 0 &&
                              <TableCell align="right">
                                {row?.detections?.map((detection, i) => {
                                  let classes = detection?.classes?.map((c) => c?.class).join(', ');
                                  console.log({ classes })
                                  return (
                                    <span
                                      key={`${i}-detections`}
                                      style={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      &nbsp;
                                      {classes}
                                    </span>
                                  )
                                })}
                              </TableCell>
                            }
                            <TableCell align="right">{row?.function_parms?.count ?? 0}</TableCell>
                            <TableCell
                              align="right"
                            >
                              {(row?.detections ?? []).length}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </Grid>
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
    </Grid>
  )
}