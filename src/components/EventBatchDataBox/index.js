// React
import React from 'react';


import Box from '@mui/material/Box';


import DataBox from './DataBox';
import GraphBox from './GraphBox';


const mainBoxSx ={
  // bgcolor: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: 0.25,
  overflowX: 'auto',
  overflowY: 'hidden',
  width: "100%",
  whiteSpace: "pre-wrap", //TODO: Remove this line. Debug only
  bgcolor: '#D0D0D0'
};


const styleSx = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, {opacity: 0.8}),
};

export default function EventBatchDataBox({data, countData, config, disabled}) {

  return (
    <Box width={config.width} height={config.height} sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}>
      {(config.components.GraphBox?.active ?? true) && (
        <GraphBox countData={countData} config={config?.components?.GraphBox}/>
      )}

      {(config.components.DataBox?.active ?? true) && (
        <DataBox data={data} config={config?.components?.DataBox}/>
      )}
    </Box>
  );
};