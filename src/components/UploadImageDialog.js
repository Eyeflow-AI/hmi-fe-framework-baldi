// React
import React, { useEffect, useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import DownloadIcon from '@mui/icons-material/Download';
import { Button, TextField, Typography } from '@mui/material';
import { getUser } from '../store/slices/auth';

// Internal
import API from '../api';

// Third-party
import { TransformWrapper, TransformComponent } from '@pronestor/react-zoom-pan-pinch';
import { downloadImage, colors, getAnnotatedImage } from 'sdk-fe-eyeflow';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const gridToolbarSx = {
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const appBarSx = {
  width: '100%',
  height: 200,
  bgcolor: 'primary.main',
  color: 'white',
  boxShadow: 1,
};


export default function ImageDialog({ imagePath, title, open, setOpen }) {
  const { t } = useTranslation();
  const [noImage, setNoImage] = useState(false);
  const [selectedObj, setSelectedObj] = useState(null);
  const [dataset, setDataset] = useState('');
  const user = useSelector(getUser);
  const [base64Str, setBase64Str] = useState('');
  const [errorInText, setErrorInText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);


  const handleUpload = () => {
    let data = JSON.parse(dataset);

    setLoading(true);
    API.post.uploadImageInfo({
      data: {
        ...data,
        img_height: imgHeight,
        img_width: imgWidth,
        date: new Date(),
        user_name: user.tokenPayload.payload.username ?? '',
      },
      imageBase64: base64Str,
    })
      .then((res) => {
        setLoading(false);
      });
  };



  const handleClose = () => {
    setOpen(false);
  };


  const checkJson = (json) => {
    try {
      let jsonParsed = JSON.parse(json);
      if (!jsonParsed.dataset_id || !jsonParsed.part_number) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (dataset) {
      let flag = checkJson(dataset);
      setErrorInText(!flag);
    } else {
      setErrorInText(true);
    }
  }, [dataset]);


  useEffect(() => {
    if (!open) {
      setNoImage(false);
      if (selectedObj?.originalUrl !== imagePath) {
        URL.revokeObjectURL(selectedObj?.url);
      }
    } else {
      setSelectedObj({
        url: imagePath,
        originalUrl: imagePath,
      });
    }
  }, [open]);

  const getDocument = (selectedParam) => {
    API.get
      .appParameterDocument({ parameterName: selectedParam })
      .then((res) => {
        setDataset(JSON.stringify(res?.document.data ?? {}, undefined, 4));
      })
      .finally(() => { });
  };

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  useEffect(() => {
    getDocument('example');
    let img = new Image();
    img.src = imagePath;
    img.crossOrigin = 'Anonymous';

    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL('image/png')
      setBase64Str(dataUrl)
      setImgWidth(img.width);
      setImgHeight(img.height);
    };
  }, [imagePath]);


  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <Box sx={appBarSx}>
        <Toolbar style={{ textShadow: '1px 1px #00000080' }}>
          <Grid container sx={gridToolbarSx}>
            <Grid xs={10} item>
              <Box display="flex" justifyContent="flex-start" alignItems="flex-start" width="100%" gap={3}>
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {title}
                </Typography>
              </Box>
            </Grid>
            <Grid xs={2} item>
              <Box display="flex" justifyContent="flex-end">
                <IconButton edge="start" color="inherit" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Box>
      <Box>
        {!noImage ? (
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
            <TransformWrapper wheel={{ step: 0.2 }} limitToBounds={true}>
              {({ resetTransform }) => (
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <TransformComponent>
                    <img
                      src={selectedObj?.url}
                      alt={''}
                      onLoad={() => resetTransform()}
                      style={{
                        objectFit: 'cover',
                        width: "calc(2560px * 0.15)",
                        height: "calc(1440px * 0.15)",
                      }}
                    />
                  </TransformComponent>

                  <TextField
                    id="outlined-multiline-static"
                    label="Image JSON"
                    multiline
                    rows={4}
                    variant="outlined"
                    color="secondary"
                    sx={{
                      width: '60rem',
                    }}
                    error={errorInText}
                    value={dataset}
                    onChange={(e) => setDataset(e.target.value)}
                    helperText={errorInText ? `O formato tem que ser este: {
                        "dataset_id": "",
                        "part_number": ""
                    }` : ''}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    sx={{
                      width: '20rem',
                    }}
                    disabled={disabled || errorInText || loading}
                  >
                    Save image info
                  </Button>
                </Box>
              )}
            </TransformWrapper>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: 'calc(100vh - 80px)',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '100px',
            }}
          >
            No image
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
