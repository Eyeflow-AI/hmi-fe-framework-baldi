// React
import React, { useState } from 'react';

// Design
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Fade from '@mui/material/Fade';
import MenuItem from '@mui/material/MenuItem';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

// Internal
import SiliconCopyright from '../../components/SiliconCopyright';
import login from '../../store/thunks/login';
import { getStationList, getStationId, setStationId } from '../../store/slices/app';
import { getLoadingLogin } from '../../store/slices/auth';
import { setNotificationBar } from '../../store/slices/app';

// Third-Party
import { useTranslation } from "react-i18next";
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';


const styleSx = {
  mainBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '85vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBox: {
    bgcolor: 'background.paper',
    boxShadow: 2,
    borderRadius: '12px',
    padding: (theme) => theme.spacing(2, 5, 2, 5),
    marginTop: 1,
    alignItems: 'center',
    width: 350,
    // maxWidth: '100%',
    // maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  grid: {
    width: 340
  },
  textfield: {
    width: 300,
  },
  cardMedia: {
    maxWidth: '22em',
  },
  loginButton: {
    width: 300,
    // marginTop: 1
  },
};

export default function Login() {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const stationList = useSelector(getStationList);
  const stationId = useSelector(getStationId);
  const loginLoading = useSelector(getLoadingLogin);

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const onClickLoginButton = (event) => {
    event.preventDefault();
    dispatch(login({ username: user, password: password }))
      .then(unwrapResult)
      .catch((err) => {
        if (err.message === "Network Error") {
          dispatch(setNotificationBar({ show: true, type: 'error', message: "network_error" }));
        }
        else if (err.message === "Wrong username/password") {
          dispatch(setNotificationBar({ show: true, type: 'error', message: 'invalid_username/password' }));
        }
        else {
          dispatch(setNotificationBar({ show: true, type: 'error', message: 'internal_server_error' }));
        };
      });
  };

  const onChangeUser = (event) => {
    setUser(event.currentTarget.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onChangeStation = (event) => {
    dispatch(setStationId(event.target.value));
  };

  return (
    <Fade in={true} timeout={800} >
      <Box sx={styleSx.mainBox}>
        <CardMedia
          sx={styleSx.cardMedia}
          image={"/assets/EyeFlowInspection-mask.png"}
          title="Eyeflow Inspection"
          component="img"
        />
        <form noValidate onSubmit={onClickLoginButton}>
          <Box sx={styleSx.loginBox}>
            <Grid container direction='column' alignItems="center" justifyContent="flex-start" spacing={2} sx={styleSx.grid}>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={t("user")}
                  name="user"
                  // autoComplete="email"
                  autoComplete="off"
                  autoFocus
                  onChange={onChangeUser}
                  sx={styleSx.textfield}
                />
              </Grid>

              <Grid item>
                <Box height={90}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    // autoComplete="current-password"
                    autoComplete="off"
                    onChange={onChangePassword}
                    sx={styleSx.textfield}
                  />
                </Box>
              </Grid>

              <Grid item>
                <FormControl sx={styleSx.textfield}>
                  <InputLabel>{t("station")}</InputLabel>
                  <Select
                    value={stationId}
                    label={t("station")}
                    onChange={onChangeStation}
                  >
                    {stationList.map(({ _id, label }) => (
                      <MenuItem key={_id} value={_id}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item>
                {
                  loginLoading
                    ? <CircularProgress />
                    : (
                      <Button
                        type="submit"
                        // onClick={onClickLoginButton}
                        variant="contained"
                        sx={styleSx.loginButton}
                      >
                        {t('Login')}
                      </Button>
                    )
                }
              </Grid>
            </Grid>
            <Box sx={{ marginTop: 2 }}>
              <SiliconCopyright />
            </Box>
          </Box>
        </form>
      </Box>
    </Fade>
  );
}
