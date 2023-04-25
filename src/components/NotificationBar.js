// React
import React, { useState } from 'react';

// Design
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// Internal
import { getNotificationBarInfo } from '../store/slices/app';

// Third-Party
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';




export default function NotificationBar() {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const info = useSelector(getNotificationBarInfo);

  const [open, setOpen] = useState(true);
  const [severity, setSeverity] = useState('info');


  return (
    <>
      {
        info?.show &&
        <Alert
          severity={info?.type}
          sx={{
            width: '100%'
            , position: 'absolute'
            , zIndex: 1000
            , top: 0
          }}
        >
          <AlertTitle>{t(severity)}</AlertTitle>
          This is an error alert — <strong>check it out!</strong>
        </Alert>
      }
    </>
  );
}