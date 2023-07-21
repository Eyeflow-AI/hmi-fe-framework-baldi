// React
import React from 'react';


//Design
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//Internal
import '../../css/animateFlicker.css';

//Third-party
import { useTranslation } from "react-i18next";
import { colors } from 'sdk-fe-eyeflow';
import dateFormat from 'sdk-fe-eyeflow/functions/dateFormat';


const style = {
  itemSx: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 2,
    width: '100%',
    height: '100%',
    borderRadius: 1,
    cursor: 'pointer',
    color: 'white',
    textShadow: '1px 1px 2px #404040',
    '&:hover': {
      boxShadow: (theme) => `${theme.shadows[3]}, inset 0 0 0 2px black`,
    },
  },
  itemHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 1,
    paddingRight: 1,
  },
  itemImageBox: {
    marginTop: -1
  },
  itemImage: {
    height: "auto", width: "100%" //TODO: Fix height in Fire Fox
  },
  itemFooter: {
    paddingBottom: 0.2,
  },
}

style.selectedItemSx = Object.assign({}, style.itemSx, {
  boxShadow: (theme) => `${theme.shadows[2]}, inset 0 0 0 2px black`,
});


export default function EventMenuItem({
  index
  , dateField
  , eventData
  , selected
  , onClick
  , conveyorIcon
}) {

  const { t } = useTranslation();

  const filesWSURL = window.app_config.hosts['hmi-files-ws']['url'];
  let thumbURL = eventData?.thumbURL ?? conveyorIcon;
  let thumbStyle = Boolean(eventData.thumbStyle) ? eventData.thumbStyle : style.itemImage;
  let status = eventData.status ?? '';
  let eventTimeString = Boolean(eventData[dateField]) ? dateFormat(eventData[dateField]) : "";
  let label = eventData.label ?? '';

  let boxStyle = Object.assign(
    { backgroundColor: selected ? colors.statuses[status] : `${colors.statuses[status]}90` },
    selected ? style.selectedItemSx : style.itemSx
  );

  return (
    <Box
      sx={boxStyle}
      onClick={onClick}
    >
      <Box sx={style.itemHeader}>
        <Box>
          <Typography variant='h6'>
            {index}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="end">
          <Box marginBottom={-1}>
            <Typography variant='subtitle1'>
              {label}
            </Typography>
          </Box>
          <Box className={status === "running" ? "animate-flicker" : undefined}>
            <Typography variant='subtitle2'>
              {t(status)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {thumbURL && (
        <Box sx={style.itemImageBox}>
          <img alt="" src={thumbURL} style={thumbStyle} />
        </Box>
      )}

      <Box sx={style.itemFooter}>
        <Typography variant="subtitle2">
          {eventTimeString}
        </Typography>
      </Box>
    </Box>
  )
};