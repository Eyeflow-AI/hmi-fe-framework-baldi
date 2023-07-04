// React
import React, { useEffect, useState } from 'react';

// Design
import { Box, Typography, Card, CardMedia } from '@mui/material';

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


  const HEIGHT = [1, 1, 1, 2, 2, 2];
  const WIDTH = [1, 2, 3, 3, 3, 3];

  return (
    <PageWrapper>
      {({ width, height }) =>
        <Box
          width={width}
          height={height}
          sx={style.mainBox}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              overflow: 'hidden',
            }}
          >
            {imagesList.map((item, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    height: `calc(100% / ${HEIGHT[imagesList.length - 1]})`,
                    width: `calc(100% / ${WIDTH[imagesList.length - 1]})`,
                    flexDirection: 'column',
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
                        width: `calc(${pageOptions?.options?.IMAGE_SIZES[String(imagesList.length)]} - 10rem)`,
                        height: pageOptions?.options?.IMAGE_SIZES[String(imagesList.length)],
                        display: 'block',
                        margin: 'auto',
                        paddingBottom: '.5rem',
                      }}
                    />
                  </Card>

                  <Typography textAlign='center'>
                    {`${item.camera_name}`}
                  </Typography>
                </Box>
              )
            })
            }
          </Box>


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


