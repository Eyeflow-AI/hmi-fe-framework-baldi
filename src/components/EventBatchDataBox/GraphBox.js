// React
import React from 'react';


import Box from '@mui/material/Box';


const styleSx = {
  graphBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
  }),
};

export default function GraphBox({countData, config}) {

  return (
    <Box width={config?.width ?? 250} height={config?.height ?? '100%'} sx={styleSx.graphBoxSx}>
      {JSON.stringify(countData, null, 1)}
    </Box>
  );
};