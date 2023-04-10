// React
import React from 'react';

// Design
import Box from '@mui/material/Box';

// Internal
import PageWrapper from '../../components/PageWrapper';

// Third-party


const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    display: 'flex',
    flexGrow: 1,
  }),
};


export default function Query({ pageOptions }) {

  return (
    <PageWrapper>
      {(width, height) =>
        <Box width={width} height={height} sx={style.mainBox}>
          TODO: Query
        </Box>
      }
    </PageWrapper>
  )
}


