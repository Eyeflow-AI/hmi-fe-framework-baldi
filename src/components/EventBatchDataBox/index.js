// React
import React from 'react';


import Box from '@mui/material/Box';


import DataBox from './DataBox';
import GraphBox from './GraphBox';


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
      <GraphBox countData={countData} config={config?.components?.GraphBox}/>
      <DataBox data={data} config={config?.components?.DataBox}/>
    </Box>
  );
};