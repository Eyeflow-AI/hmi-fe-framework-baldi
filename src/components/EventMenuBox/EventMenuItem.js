// React
import React from 'react';


//Design
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


//Third-party
import colors from 'sdk-fe-eyeflow/functions/colors';
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
    alignItems: 'center',
    paddingLeft: 1,
    paddingRight: 1,
  },
  itemImageBox: {
    paddingLeft: 1.5,
    paddingRight: 1.5,
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

export default function EventMenuItem ({index, dateField, eventData, selected, onClick}) {

  let thumbURL = eventData.thumbURL ?? '';
  let thumbStyle = Boolean(eventData.thumbStyle) ? eventData.thumbStyle : style.itemImage;
  let status = eventData.status ?? '';
  let eventTimeString = Boolean(eventData[dateField]) ? dateFormat(eventData[dateField]) : "";
  let label = eventData.label ?? '';

  let boxStyle = Object.assign(
    {backgroundColor: selected ? colors.statuses[status] : `${colors.statuses[status]}90`},
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
          <Box>
            <Typography variant='h6'>
              {label}
            </Typography>
          </Box>
        </Box>

        {thumbURL && (
        <Box sx={style.itemImageBox}>
          <img alt="" src={thumbURL} style={thumbStyle}/>
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