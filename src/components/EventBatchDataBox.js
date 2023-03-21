// React
import React, {useMemo} from 'react';


import Box from '@mui/material/Box';


const mainBoxSx = Object.assign(
  {},
  window.app_config.style.box,
  {
    bgcolor: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    paddingLeft: 1,
    overflowX: 'auto',
    overflowY: 'hidden',
    width: "100%",
  }
);

const styleSx = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, {opacity: 0.8}),
};

export default function EventBatchDataBox({data, config, disabled}) {

  return (
    <Box width={config.width} height={config.height} sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}>
    </Box>
  );
};