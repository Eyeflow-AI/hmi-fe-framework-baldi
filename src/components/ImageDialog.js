// React
import React, { useEffect, useState } from "react";

// Design
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

// Internal


// Third-party
import { TransformWrapper, TransformComponent } from "@pronestor/react-zoom-pan-pinch";
import { Typography } from "@mui/material";
import { downloadImage, colors, getAnnotatedImage } from 'sdk-fe-eyeflow';
import { useTranslation } from "react-i18next";

const gridToolbarSx = {
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const appBarSx = {
  width: '100%',
  height: 64,
  bgcolor: 'primary.main',
  color: 'white',
  boxShadow: 1
};

// import expandCoordinates from "./utils/expandCoordinates";

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
    console.log({ height: img.height, width: img.width })

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
        console.log({ bb })
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
        console.log({ canvasURL })
        return canvasURL;
      }
      else {
        if (options?.camera) {
          setAnnotatedImage(options.camera, canvas.toDataURL("image/jpeg"));
        }
        else {
          setAnnotatedImage(canvas.toDataURL("image/jpeg"), image);

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
          setAnnotatedImage({ index, url: canvas.toDataURL("image/jpeg"), notAnnotatedURL: notAnnotatedCanvas.toDataURL("image/jpeg") });
        }
      }
    }


  };
};



export default function ImageDialog({ imagePath, title, altText, style, open, setOpen, otherImages }) {

  const { t } = useTranslation();
  const [noImage, setNoImage] = useState(false);
  const [selectedObj, setSelectedObj] = useState(null);

  const handleClose = () => {
    setOpen(false);
  }

  console.log({ otherImages })


  useEffect(() => {
    if (!open) {
      setNoImage(false);
      if (selectedObj?.originalUrl !== imagePath) {
        URL.revokeObjectURL(selectedObj?.url);
      }
    }
    else {
      setSelectedObj({
        url: imagePath,
        originalUrl: imagePath,
      });
      // setNoImage(false);
    }
  }, [open])

  const handleChangeImage = (url, originalUrl) => {
    if (selectedObj?.originalUrl !== imagePath) {
      URL.revokeObjectURL(selectedObj?.url);
    }
    if (url) {
      setSelectedObj({
        url: url,
        originalUrl: originalUrl ?? url,
      });
    }
  }

  const handleAnnotateImage = (obj) => {
    let url = obj.url;
    if (obj.annotate) {
      getAnnotatedImg({
        image: url,
        bbox: obj.bboxes,
        scale: 1,
        setAnnotatedImage: handleChangeImage,
        options: {
          // returnCanvasURL: true,
          severalAnnotations: true,
        }
      })
    }
    else {
      handleChangeImage(url, obj.url);
    }
  }


  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      sx={{
        // zIndex: 99999999999999
      }}
    >
      <Box sx={appBarSx}>
        <Toolbar style={{ textShadow: '1px 1px #00000080' }}>
          <Grid container sx={gridToolbarSx}>
            <Grid xs={10} item>
              <Box
                display='flex'
                justifyContent='flex-start'
                alignItems='flex-start'
                width='100%'
                gap={3}
              >
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    textTransform: 'uppercase'
                  }}
                >
                  {title}
                </Typography>
                <Box
                  display='flex'
                  justifyContent='flex-start'
                >
                  <Tooltip title={t('download')}>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={() => downloadImage(selectedObj?.url, title)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
            <Grid xs={2} item>
              <Box
                display='flex'
                justifyContent='flex-end'
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Box>
      <Box>
        {
          !noImage ?

            <Box
              sx={{
                display: 'flex',
                width: '100%',
                height: 'calc(100vh - 80px)',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'nowrap',
                flexDirection: 'column',
              }}
            >
              <TransformWrapper
                wheel={{ step: 0.2 }}
                limitToBounds={true}
              >
                {({ resetTransform }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      height: '80%',
                      width: '100%',
                      // position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'flex-start'
                    }}
                  >
                    <TransformComponent>
                      <img
                        src={selectedObj?.url}
                        alt={altText ?? ''}
                        onLoad={() => resetTransform()}
                        style={{
                          // ...style,
                          color: 'white',
                          height: 'calc(100vh - 15rem)',
                          width: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </TransformComponent>
                  </Box>
                )}
              </TransformWrapper>
              {
                otherImages && Object.keys(otherImages).length > 0 &&
                <Box
                  sx={{
                    display: 'flex',
                    // flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: 0,
                    marginBottom: 0,
                    paddingTop: 0,
                    marginTop: '2rem',
                    height: '10rem',
                    width: '100%',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    overflow: 'auto'
                  }}
                >
                  <Card sx={{
                    width: '150px',
                    height: '100px',
                    margin: '0.25rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: 1,
                    borderRadius: '1rem',
                    cursor: selectedObj?.originalUrl === imagePath ? 'default' : 'pointer',
                    marginBottom: '1rem',
                    border: selectedObj?.originalUrl === imagePath ? '2px solid white' : 'none',
                  }}
                    // key={index}
                    onClick={() => handleChangeImage(imagePath, imagePath)}
                  >
                    <CardMedia
                      component="img"
                      image={imagePath}
                      style={{
                        objectFit: 'cover',
                        width: "calc(2560px * 0.15)",
                        height: "calc(1440px * 0.15)",
                      }}
                    />
                  </Card>
                  {
                    Object.keys(otherImages).map((key, index) => {
                      return (
                        <Card sx={{
                          width: '150px',
                          height: '100px',
                          margin: '0.25rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: 1,
                          borderRadius: '1rem',
                          cursor: selectedObj?.originalUrl === otherImages?.[key].url ? 'default' : 'pointer',
                          marginBottom: '1rem',
                          border: selectedObj?.originalUrl === otherImages?.[key].url ? '2px solid white' : 'none',
                        }}
                          key={index}
                          onClick={() => handleAnnotateImage(otherImages?.[key])}
                        >
                          <CardMedia
                            component="img"
                            image={otherImages?.[key].url}
                            style={{
                              objectFit: 'cover',
                              width: "calc(2560px * 0.15)",
                              height: "calc(1440px * 0.15)",
                            }}
                          />
                        </Card>
                      )

                    })
                  }
                </Box>
              }
            </Box>
            :
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                height: 'calc(100vh - 80px)',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '100px'
              }}
            >
              No image
            </Box>
        }
      </Box>

    </Dialog >
  );
};