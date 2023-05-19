// React
import React, { useEffect, useState } from 'react';

// Design
import { Box, Grid, Typography, Card, CardMedia } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';
import ImageDialog from '../../components/ImageDialog';
import GetImagesList from '../utils/Hooks/GetImagesList';

// Third-party

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



export default function Monitor({ pageOptions }) {



  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [infoURL, setInfoURL] = useState('');
  const [imageURL, setImageURL] = useState('');
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
      setImageURL(pageOptions?.options?.imageURL);
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
            justifyContent="space-evenly"
            alignItems="space-evenly"
            direction={imagesList.length > 2 ? 'row' : 'column'}
            spacing={2}
          >
            {imagesList.map((item, index) => {
              return (
                <Grid
                  item
                  xs={pageOptions?.options?.GRID_SIZES[String(imagesList.length)]}
                  key={index}
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: 1,
                      borderRadius: '1rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => { setOpenDialog(true); setDialogTitle(`${item.camera_name} - ${item.frame_time}`); setImagePath(`${infoURL}/${item.camera_name}`) }}
                  >
                    <CardMedia
                      component="img"
                      image={`${imageURL}/${item.camera_name}?time=${new Date().getTime()}`}
                      style={{
                        objectFit: 'contain',
                        // width: "calc(2560px * 0.15)",
                        width: pageOptions?.options?.IMAGE_SIZES[String(imagesList.length)],
                        height: pageOptions?.options?.IMAGE_SIZES[String(imagesList.length)],
                        display: 'block',
                        margin: 'auto',
                        paddingBottom: '.5rem',
                      }}
                    />
                    {/* <img
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
                  /> */}
                    <Typography textAlign='center'>
                      {`${item.camera_name}`}
                    </Typography>
                  </Card>
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


