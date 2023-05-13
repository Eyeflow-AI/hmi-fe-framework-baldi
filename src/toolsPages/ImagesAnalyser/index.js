// React
import React, { useEffect, useState } from 'react';

// Design
import { Box, Grid, Typography } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';
import ImageDialog from '../../components/ImageDialog';
import GetImagesList from '../utils/Hooks/GetImagesList';

// Third-party
import { useTranslation } from "react-i18next";

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    // bgcolor: 'red',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }),
};

const GRID_SIZES = {
  1: 12,
  2: 12,
  3: 6,
  4: 6,
  5: 4,
  6: 4,
}

const IMAGE_SIZES = {
  1: '1000px',
  2: '500px',
  3: '480px',
  4: '480px',
  5: '450px',
  6: '450px',
}


export default function ImagesAnalyser({ pageOptions }) {

  const { t } = useTranslation();


  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [infoURL, setInfoURL] = useState('');
  const [imagePath, setImagePath] = useState('');
  const { imagesList } = GetImagesList({ url: infoURL, sleepTime: pageOptions?.options?.sleepTime });

  useEffect(() => {
    if (!openDialog) {
      setDialogTitle('');
      setImagePath('');
    }
  }, [openDialog]);

  useEffect(() => {
    if (pageOptions?.options?.infoURL) {
      setInfoURL(pageOptions?.options?.infoURL);
    }
  }, [pageOptions]);

  return (
    <PageWrapper>
      {(width, height) =>
        <Box
          width={width}
          height={height}
          sx={style.mainBox}
        >
          <Grid
            container
            height='100%'
            justifyContent="center"
            alignItems="center"
            direction={imagesList.length > 2 ? 'row' : 'column'}
          >
            {imagesList.map((item, index) => {
              return (
                <Grid
                  item
                  xs={GRID_SIZES[imagesList.length]}
                  key={index}
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={`${infoURL}/${item.camera_name}?time=${new Date().getTime()}`}
                    style={{
                      objectFit: 'stretch',
                      // width: "calc(2560px * 0.15)",
                      width: IMAGE_SIZES[imagesList.length],
                      height: IMAGE_SIZES[imagesList.length],
                      display: 'block',
                      margin: 'auto',
                      paddingBottom: '.5rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => { setOpenDialog(true); setDialogTitle(`${item.camera_name} - ${item.frame_time}`); setImagePath(`${infoURL}/${item.camera_name}`) }}
                  />
                  <Typography textAlign='center'>
                    {`${item.camera_name}`}
                  </Typography>
                </Grid>
              )
            })
            }
          </Grid>


          <ImageDialog
            open={openDialog}
            setOpen={setOpenDialog}
            imagePath={imagePath}
            title={dialogTitle}
          />
        </Box>
      }
    </PageWrapper>
  )
}


