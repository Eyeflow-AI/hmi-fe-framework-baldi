// React
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';

// Design
import { Box, Typography, Card, CardMedia } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';
import UploadImageDialog from '../../components/UploadImageDialog';
import ImageDialog from '../../components/ImageDialog';
import GetImagesList from '../utils/Hooks/GetImagesList';
import GetEdgeEnvVar from '../../utils/Hooks/GetEdgeEnvVar';

import axios from 'axios';
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

export default function ImagesCapturer({ pageOptions }) {
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openImageInfoDialog, setOpenImageInfoDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [takeOneFrame, setTakeOneFrame] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const { imageBaseURL, infoURL, envVarURL, appbarButtonList } = useMemo(() => {
    return {
      imageBaseURL: pageOptions?.options?.imageURL ?? '',
      infoURL: pageOptions?.options?.infoURL ?? '',
      envVarURL: pageOptions?.options?.envVarURL ?? '',
      appbarButtonList: pageOptions?.options?.appbarButtonList ?? [],
    };
  }, [pageOptions]);
  const { clock, imagesList } = GetImagesList({ url: infoURL, imageBaseURL, sleepTime: pageOptions?.options?.sleepTime });
  const { envVar, updateData: updateEnvVarData } = GetEdgeEnvVar({ url: envVarURL, sleepTime: pageOptions?.options?.sleepTime });

  const onOpenDialog = useCallback((item) => {
    return () => {
      setOpenImageDialog(true);
      setDialogTitle(item?.frame_time ? `${item?.camera_name} - ${item?.frame_time}` : `${item?.camera_name}`);
      setImagePath(item?.full_url);
    };
  }, []);

  const { recording } = useMemo(() => {
    return {
      recording: envVar?.video_save === 'start',
    };
  }, [envVar]);


  useEffect(() => {
    if (!openImageDialog && !openImageInfoDialog) {
      setDialogTitle('');
      setImagePath('');
    }
  }, [openImageDialog, openImageInfoDialog]);

  const HEIGHT = [1, 1, 1, 2, 2, 2];
  const WIDTH = [1, 2, 3, 3, 3, 3];

  const onClickRecord = useCallback(() => {
    if (envVarURL) {
      axios({
        method: 'put',
        url: envVarURL,
        responseType: 'json',
        data: {
          env_var: {
            video_save: recording ? 'stop' : 'start',
          },
        },
      })
        .then(() => {
          updateEnvVarData();
        })
        .catch(console.error);
    }
  }, [recording, envVarURL]);

  const refImagesList = useRef(imagesList);

  useEffect(() => {
    refImagesList.current = imagesList;
  }, [imagesList]);

  const onClickCapture = useCallback((item) => {
    setDialogTitle(item?.frame_time ? `${item?.camera_name} - ${item?.frame_time} ` : `${item?.camera_name} `)
    setImagePath(item?.full_url)
    setOpenImageInfoDialog(true)
  }, [imagesList])

  const appButtons = useMemo(() => {
    return appbarButtonList.map((item, index) => {
      let icon = item.icon;
      let onClick;
      if (item.id === 'start') {
        icon = recording ? item.stopIcon : item.recordIcon;
        onClick = onClickRecord;
      } else if (item.id === 'capture') {
        onClick = () => onClickCapture(refImagesList.current[0]);
      } else {
        onClick = () => console.log(`${item.label} not implemented yet!`);
      }
      return {
        ...item,
        icon,
        onClick,
      };
    });
  }, [appbarButtonList]);

  return (
    <PageWrapper extraButtons={appButtons}>
      {({ width, height }) => (
        <Box width={width} height={height} sx={style.mainBox}>
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
                      image={`${item?.full_url}?time=${clock}`}
                      style={{
                        objectFit: 'contain',
                        width: `calc(${pageOptions?.options?.IMAGE_SIZES[String(imagesList.length)]} - 10rem)`,
                        height: pageOptions?.options?.IMAGE_SIZES[String(imagesList.length)],
                        display: 'block',
                        margin: 'auto',
                        paddingBottom: '.5rem',
                      }}
                    />
                  </Card>

                  <Typography textAlign="center">{`${item.camera_name}`}</Typography>
                </Box >
              );
            })}
          </Box>
          <ImageDialog
            open={openImageDialog}
            setOpen={setOpenImageDialog}
            imagePath={imagePath}
            title={dialogTitle}
          />
          <UploadImageDialog open={openImageInfoDialog} setOpen={setOpenImageInfoDialog} imagePath={imagePath} title={dialogTitle} />
        </Box >
      )}
    </PageWrapper >
  );
}
