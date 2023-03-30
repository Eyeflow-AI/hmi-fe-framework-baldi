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
    height: 60,
    paddingTop: 0.2,
    paddingLeft: 0.8,
    paddingRight: 0.8,
    // paddingBottom: 0.1,
  }
};

export default function LabelBox({title, minWidth, label}) {

  const { t } = useTranslation();

  return (
    <Box sx={styleSx.itemBox} minWidth={minWidth}>
      <Box>
        <Typography variant="subtitle2">
          {t(title)}
        </Typography>
      </Box>
      <Box>
        <Typography noWrap={true} variant="h6">
          {label}
        </Typography>
      </Box>
    </Box>
  );
};