// React
import React, { useEffect, useState, useMemo, useCallback } from 'react';

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
  const [imagePath, setImagePath] = useState('');

  const { imageBaseURL, infoURL } = useMemo(() => {
    return {
      imageBaseURL: pageOptions?.options?.imageURL ?? '',
      infoURL: pageOptions?.options?.infoURL ?? '',
    }
  }, [pageOptions]);


  const { clock, imagesList } = GetImagesList({ url: infoURL, imageBaseURL, sleepTime: pageOptions?.options?.sleepTime });

  const onOpenDialog = useCallback((item) => {
    return () => {
      setOpenDialog(true);
      setDialogTitle(`${item.camera_name} - ${item.frame_time}`);
      setImagePath(item.full_url);
    }
  }, []);

  useEffect(() => {
    if (!openDialog) {
      setDialogTitle('');
      setImagePath('');
    }
  }, [openDialog]);


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
                    onClick={onOpenDialog(item)}
                  >
                    <CardMedia
                      component="img"
                      image={`${item.full_url}?time=${clock}`}
                      style={{
                        objectFit: 'contain',
                        // width: "calc(2560px * 0.15)",
                        width: `calc(${pageOptions?.options?.IMAGE_SIZES[String(imagesList.length)]})`,
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
            imagePath={`${imagePath}?timestamp=${new Date().getTime()}`}
            title={dialogTitle}
          />
        </Box>
      }
    </PageWrapper>
  )
}


