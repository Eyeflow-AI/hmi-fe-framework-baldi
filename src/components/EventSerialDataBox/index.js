// React
import React from 'react';

// Design
import Box from '@mui/material/Box';

// Internal

// Third-party

const mainBoxSx = Object.assign({}, window.app_config.style.box, {
  bgcolor: 'background.paper',
  display: 'flex',
  alignItems: 'center',
  gap: 0.25,
  overflowX: 'auto',
  overflowY: 'hidden',
  width: "100%",
  whiteSpace: "pre-wrap", //TODO: Remove this line. Debug only
});


const styleSx = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, { opacity: 0.8 }),
};

export default function EventSerialDataBox({ data, config, disabled }) {

  return (
    <Box
      width={config.width}
      height={config.height}
      sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}
    >
      TODO
    </Box>
  );
};