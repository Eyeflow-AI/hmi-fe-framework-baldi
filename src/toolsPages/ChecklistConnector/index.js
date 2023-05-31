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



export default function ChecklistConnector({ pageOptions }) {



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
          ChecklistConnector
        </Box>
      }
    </PageWrapper>
  )
}


