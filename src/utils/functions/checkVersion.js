import React, { useEffect } from 'react';
// Design
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// Internal
import API from '../../api';
import authSlice from "../../store/slices/auth";
import packageJson from '../../../package.json';

// Third-Party
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function CheckVersion() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const [latestVersion, setLatestVersion] = React.useState('');
  const [showUpdateNotification, setShowUpdateNotification] = React.useState(false);

  const getDocument = () => {
    API.get.appParameterDocument({ parameterName: 'feConfig' })
      .then(res => {
        setLatestVersion(res.document.options.version);
      })
      .finally(() => {
      });
  }

  const handleClickLogout = () => {
    setShowUpdateNotification(false);
    dispatch(authSlice.actions.logout());
  };


  useEffect(() => {
    if (isLoginPage) return;
    getDocument();
  }, [isLoginPage]);

  useEffect(() => {
    const checkForNewVersion = async () => {
      try {
        if (latestVersion && latestVersion !== packageJson.version) {
          setShowUpdateNotification(true);
        }
      } catch (error) {
        console.error('Error checking for new version:', error);
      }
    };

    checkForNewVersion();
  }, [
    location.pathname,
    latestVersion
  ]);


  return (
    <Dialog
      open={showUpdateNotification}
      onClose={() => setShowUpdateNotification(false)}
      sx={{
        textAlign: 'center',
      }}
      onTouchCancel={() => setShowUpdateNotification(false)}
    >
      <DialogContent>
        <DialogContentText>
          {t("new_version_warning")}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={() => handleClickLogout()}
          sx={{
            padding: '10px 20px',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            bgcolor: "primary.main",
            '&:hover': {
              bgcolor: "primary.dark",
            }

          }}
        >
          {t("log_out")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
