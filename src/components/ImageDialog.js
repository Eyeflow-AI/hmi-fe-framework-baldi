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

// Internal


// Third-party
import { TransformWrapper, TransformComponent } from "@pronestor/react-zoom-pan-pinch";
import { Typography } from "@mui/material";
import { downloadImage } from 'sdk-fe-eyeflow';
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


export default function ImageDialog({ imagePath, title, altText, style, open, setOpen }) {

  const { t } = useTranslation();
  const [noImage, setNoImage] = useState(false);

  const handleClose = () => {
    setOpen(false);
  }



  useEffect(() => {
    if (!open) {
      setNoImage(false);
    }
  }, [open])



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
                      onClick={() => downloadImage(imagePath, title)}
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
                      height: '100%',
                      width: '100%',
                      // position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <TransformComponent>
                      <img
                        src={imagePath}
                        alt={altText ?? ''}
                        onLoad={() => resetTransform()}
                        style={{
                          // ...style,
                          color: 'white',
                          height: 'calc(100vh - 6rem)',
                          width: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </TransformComponent>
                  </Box>
                )}
              </TransformWrapper>
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

    </Dialog>
  );
};