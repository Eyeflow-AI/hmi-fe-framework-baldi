// React
import React from 'react';


import Box from '@mui/material/Box';


const style = {
  dataBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
  }),
};

export default function DataBox({data, config}) {

  return (
    <Box width={config?.width ?? "calc(100vw - 502px)"} height={config?.height ?? "100%"} sx={style.style}>
      {JSON.stringify(data, null, 1)}
    </Box>
  );
};