// React
import React, { useEffect, useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

// Internal
import API from '../api';

// Third-party
import { useTranslation } from 'react-i18next';
import { Button, TextField, Typography } from '@mui/material';
import { TransformWrapper, TransformComponent } from '@pronestor/react-zoom-pan-pinch';
import { getUser } from '../store/slices/auth';
import { useSelector } from 'react-redux';

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
  boxShadow: 1,
};

export default function ImageDialog({ imagePath, title, open, setOpen, imageId }) {
  const { t } = useTranslation();
  const [noImage, setNoImage] = useState(false);
  const [selectedObj, setSelectedObj] = useState(null);
  const [dataset, setDataset] = useState('');
  const user = useSelector(getUser);

  const handleUpload = () => {
    let data = JSON.parse(dataset);
    API.post
      .postCustomEvent({
        eventList: [
          {
            collection: 'events_to_upload',
            original_collection: 'images_capture',
            data: {
              ...data,
              example: imageId,
              example_thumb: `${imageId}_thumb.jpg`,
              example_path: data.dataset_id,
              img_height: imgHeight,
              img_width: imgWidth,
              date: new Date(),
              user_name: user,
            },
            imageURL: imagePath,
          },
        ],
      })
      .then((res) => {
        console.log(res);
        handleClose();
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        setDataset(JSON.stringify(res?.document.examples.mask_map_example ?? {}, undefined, 4));
      })
      .finally(() => {});
  };

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  useEffect(() => {
    getDocument('examples_types');
    let img = new Image();
    img.src = imagePath;

    img.onload = function () {
      setImgWidth(img.width);
      setImgHeight(img.height);

      console.log('Image width: ' + imgWidth);
      console.log('Image height: ' + imgHeight);
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
                        color: 'white',
                        height: 'calc(100vh - 13rem)',
                        width: '100%',
                        objectFit: 'contain',
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
                    value={dataset}
                    onChange={(e) => setDataset(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    sx={{
                      width: '20rem',
                    }}
                    disabled={!dataset}
                  >
                    Upload Image
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
