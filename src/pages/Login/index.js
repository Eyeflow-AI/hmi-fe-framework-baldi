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
import ModalMessage from '../../components/ModalMessage';
import LogoEyeflowInspection from '../../assets/EyeFlowInspection-mask.png';
import login from '../../store/thunks/login';

// Third-Party
import { useTranslation } from "react-i18next";

const styleSx = {
  mainBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
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
  cardMedia: {
    maxWidth: '22em',
  },
  form: {
    // width: '100%',
  },
};

export default function Login() {

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const loginButton = {
    onClick : (event) => {
      event.preventDefault();
      dispatch(login({username: user, password: password}))
        .then(unwrapResult)
        .catch((err) => {
          setModalOpen(true)
        });
    }
  }

  const cancelButton = {
    onClick : () => {
      setUser('')
      setPassword('')
    }
  };

  return (
    <>
      <ModalMessage
        title='Login Error'
        description='Invalid username or password.'
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        width={300}
      />
        <Fade in={true} timeout={800}>
          <Box sx={styleSx.mainBox}>
            <CardMedia
              sx={styleSx.cardMedia}
              image={LogoEyeflowInspection}
              title="Eyeflow Inspection"
              component="img"
            />
            <Box sx={styleSx.loginBox}>
              <form style={styleSx.form}>
                <Grid container direction='column' alignItems="center" spacing={2} sx={{width: 340}}>
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
                      onChange={(event) => setUser(event.currentTarget.value)}
                      sx={{width: 300}}
                    />
                  </Grid>

                  <Grid item>
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
                      onChange={(event) => setPassword(event.currentTarget.value)}
                      sx={{width: 300}}
                    />
                  </Grid>

                  <Grid item>
                    <Button
                      type="submit"
                      onClick={loginButton.onClick}
                      variant="contained"
                      sx={{width: 300, marginTop: 1}}
                    >
                      {t('Login')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
              <Box sx={{marginTop: 2}}>
                <SiliconCopyright/>
              </Box>
            </Box>
          </Box>
        </Fade>
      </>
  );
}
