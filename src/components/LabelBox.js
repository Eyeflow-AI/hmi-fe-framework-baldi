// React
import React from 'react';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import { useTranslation } from "react-i18next";


const styleSx = {
  itemBox: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(133, 133, 133, 0.6)',
    borderRadius: 1,
    height: 56,
    paddingTop: 0.2,
    paddingLeft: 0.8,
    paddingRight: 0.8,
    // paddingBottom: 0.1,
  }
};

export default function EventHeader({title, label}) {

  const { t } = useTranslation();

  return (
    <Box sx={styleSx.itemBox}>
      <Box>
        <Typography variant="subtitle2">
          {t(title)}
        </Typography>
      </Box>
      <Box>
        <Typography noWrap={true}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
};