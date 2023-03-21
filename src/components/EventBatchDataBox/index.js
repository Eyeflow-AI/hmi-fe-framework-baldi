// React
import React from 'react';


import Box from '@mui/material/Box';


const mainBoxSx ={
  // bgcolor: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  overflowX: 'auto',
  overflowY: 'hidden',
  width: "100%",
  whiteSpace: "pre-wrap" //TODO: Remove this line. Debug only
};


const styleSx = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, {opacity: 0.8}),
  graphBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    width: 250,
    height: '100%'
  }),
  dataBoxSx: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    width: "calc(100vw - 502px)",
    height: '100%'
  }),
};

export default function EventBatchDataBox({data, countData, config, disabled}) {

  return (
    <Box width={config.width} height={config.height} sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}>
      <Box sx={styleSx.graphBoxSx}>
        {JSON.stringify(countData, null, 1)}
      </Box>
      <Box sx={styleSx.dataBoxSx}>
        {JSON.stringify(data, null, 1)}
      </Box>
    </Box>
  );
};