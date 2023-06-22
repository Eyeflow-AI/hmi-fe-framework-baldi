// React
import React, { } from "react";

// Design
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';

// Third-party
import { useTranslation } from "react-i18next";
import { FixedSizeList } from "react-window";
import { colors } from 'sdk-fe-eyeflow';
import API from '../api';
import {dateFormat} from "sdk-fe-eyeflow";
import { useDispatch } from 'react-redux';

import alertsThunk from '../store/thunks/alerts';

const DIALOG_WIDTH = 900;
const DIALOG_HEIGHT = 600;
const ITEM_HEIGHT = 80;
const APPBAR_HEIGHT = 50;
const ALERTBOX_HEIGHT = DIALOG_HEIGHT - APPBAR_HEIGHT;

const style = {
  dialogBox: {
    width: DIALOG_WIDTH,
    height: DIALOG_HEIGHT,
    overflow: 'hidden',
  },
  appBarSx: {
    width: DIALOG_WIDTH,
    height: APPBAR_HEIGHT,
    bgcolor: 'primary.main',
    color: 'white',
    boxShadow: 1,
    display: 'flex',
    alignItems: 'center',
    pl: 2
  },
  alertBoxSx: {
    width: DIALOG_WIDTH,
    height: ALERTBOX_HEIGHT,
    // overflowY: 'scroll',
    overflowX: 'hidden',
    // display: 'flex',
  }
}

export default function AlertsDialog({open, alerts, stationId, handleClose}) {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClickDelete = (alertId) => {
    API.delete.alert({stationId, alertId})
      .then((data) => {
        console.log({data});
        dispatch(alertsThunk({stationId}));
      })
      .catch(console.error);
  };

  function itemRenderer({ index, style }) {
    const alertData = alerts[index];
    console.log({alertData})
    const buttonStyle = {
      display: 'flex',
      borderRadius: '4px',
      // justifyContent: 'center',
      pl: 2,
      pr: 2,
      alignItems: 'center',
      height: ITEM_HEIGHT-3,
      fontSize: 18,
      color: Boolean(alertData.color) ? alertData.color : 'white',
      background: Boolean(alertData.color_text) ? alertData.color_text : colors.blue,
      width: DIALOG_WIDTH - 20,
      // padding: 1,
    };

    return (
      <div key={`item-${index}`} style={style}>
        <Box sx={buttonStyle}>
          <Box flexGrow={1}>
            {dateFormat(alertData.date)}<br/>
            {alertData.alert.locale_id}
          </Box>
          <IconButton onClick={() => onClickDelete(alertData._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </div>
    )
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <Box sx={style.dialogBox}>
        <Box sx={style.appBarSx}>
          <Typography variant="h5">
            {t('alerts')}
          </Typography>
        </Box>
        <Box sx={style.alertBoxSx}>
          <FixedSizeList
            height={ALERTBOX_HEIGHT}
            width={DIALOG_WIDTH}
            itemSize={ITEM_HEIGHT}
            itemCount={alerts.length}
          >
            {itemRenderer}
          </FixedSizeList>
        </Box>
      </Box>
    </Dialog>
  );
};