import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import { unwrapResult } from '@reduxjs/toolkit'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Fade from '@mui/material/Fade';
import CardMedia from '@mui/material/CardMedia';

import SiliconCopyright from '../../components/SiliconCopyright';
import LogoEyeflowInspection from '../../assets/EyeFlowInspection-mask.png';
import login from '../../store/thunks/login';

// Third-Party
import { useTranslation } from "react-i18next";

const styleSx = {
  mainBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '85vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBox : {
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

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errMessage, setErrMessage] = useState('');

  const onClickLoginButton = (event) => {
    event.preventDefault();
    dispatch(login({username: user, password: password}))
      .then(unwrapResult)
      .catch((err) => {
        if (err.message === "Network Error") {
          setErrMessage("Network Error");
        }
        else if (err.message === "TODO: Invalid username and password") {
          setErrMessage("Invalid username/password");
        }
        else {
          setErrMessage("Internal Server Error");
        };
      });
  };

  const onChangeUser = (event) => {
    setErrMessage('');
    setUser(event.currentTarget.value);
  };

  const onChangePassword = (event) => {
    setErrMessage('');
    setPassword(event.currentTarget.value);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={styleSx.mainBox}>
        <CardMedia
          sx={styleSx.cardMedia}
          image={LogoEyeflowInspection}
          title="Eyeflow Inspection"
          component="img"
        />
        <Box sx={styleSx.loginBox}>
          <Grid container direction='column' alignItems="center" justifyContent="flex-start" spacing={2} sx={styleSx.grid}>
            <Grid item>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Usuário"
                name="user"
                // autoComplete="email"
                autoComplete="off"
                autoFocus
                onChange={onChangeUser}
                sx={styleSx.textfield}
                error={Boolean(errMessage)}
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
                  helperText={errMessage}
                  error={Boolean(errMessage)}
                />
              </Box>
            </Grid>

            <Grid item>
              <Button
                type="submit"
                onClick={onClickLoginButton}
                variant="contained"
                sx={styleSx.loginButton}
              >
                {t('Login')}
              </Button>
            </Grid>
          </Grid>
          <Box sx={{marginTop: 2}}>
            <SiliconCopyright/>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}
