// React
import React from 'react';

// Design
import { Box } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';

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

export default function ImageAnalyser({ pageOptions }) {

  return (
    <PageWrapper>
      {(width, height) =>
        <Box
          width={width}
          height={height}
          sx={style.mainBox}
        >
          Image Analyser
        </Box>
      }
    </PageWrapper>
  )
}


