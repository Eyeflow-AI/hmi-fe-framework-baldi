// React
import React, { useState, useEffect } from 'react';

// Design
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// Internal
import { getNotificationBarInfo, setNotificationBar } from '../store/slices/app';

// Third-Party
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';




export default function NotificationBar() {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const info = useSelector(getNotificationBarInfo);
  const { show, type, message } = info;
  console.log({ info })



  useEffect(() => {
    if (show) {
      setTimeout(() => {
        dispatch(setNotificationBar(false));
      }, 5000)
    }
    // eslint-disable-next-line
  }, [show])

  return (
    <>
      {
        show &&
        <Alert
          severity={type}
          sx={{
            width: '100%'
            , position: 'absolute'
            , zIndex: 1000
            , top: 0
          }}
        >
          <AlertTitle>{t(type)}</AlertTitle>
          {t(message)}
        </Alert>
      }
    </>
  );
}