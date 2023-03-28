// React
import React from 'react';

// Design
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

// Third-party
import { useTranslation } from "react-i18next";
import {colors} from 'sdk-fe-eyeflow';

const style = {
  toolButton: Object.assign({}, window.app_config.style.box, {
    display: 'flex',
    flexDirection: 'column',
    width: 200,
    height: 200,
    alignItems: 'center',
    paddingTop: 4,
    color: 'white',
    bgcolor: "primary.main"
  }),
  toolImage: {
    width: 80,
    height: 80,
    filter:"invert(1)"
  },
};

export default function ToolButton ({pageData, onButtonClick}) {

  const { t } = useTranslation();

  const onClick = () => onButtonClick(pageData.data);

  return (
    <ButtonBase>
      <Box sx={style.toolButton} onClick={onClick}>
        <Typography gutterBottom variant="h6">
          {t(pageData.data.localeId)}
        </Typography>
        <img alt="" src={pageData.icon} style={style.toolImage}/>
      </Box>
    </ButtonBase>
  )
};