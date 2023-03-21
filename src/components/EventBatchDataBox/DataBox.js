// React
import React from 'react';


import Box from '@mui/material/Box';


const styleSx = {
  dataBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    width: "calc(100vw - 502px)",
    height: '100%'
  }),
};

export default function DataBox({data, config}) {

  console.log({config})
  return (
    <Box width={config?.width ?? "calc(100vw - 502px)"} height={config?.height ?? "100%"} sx={styleSx.dataBoxSx}>
      {JSON.stringify(data, null, 1)}
    </Box>
  );
};