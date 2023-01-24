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
    height: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBox : {
    bgcolor: 'background.paper',
    boxShadow: 2,
    borderRadius: '12px',
    padding: (theme) => theme.spacing("5em", "15em", "5em", "15em"),
    alignItems: 'center',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    maxWidth: '25em',
  },
  form: {
    maxWidth: '30em',
    width: '100%',
    marginTop: 40,
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
      <Box sx={styleSx.mainBox}>
        <Fade in={true} timeout={800}>
          <Box sx={styleSx.loginBox}>
            <CardMedia
              sx={styleSx.cardMedia}
              image={LogoEyeflowInspection}
              title="Eyeflow Inspection"
              component="img"
            />

            <form style={styleSx.form}>
              <Grid container direction='column' spacing={2}>
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
                  />
                </Grid>

                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        onClick={loginButton.onClick}
                        fullWidth
                        variant="contained"
                      >
                        {t('Login')}
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        type="reset"
                        onClick={cancelButton.onClick}
                        fullWidth
                        variant="outlined"
                      >
                        {t('Cancel')}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
            <Box mt={8}>
              <SiliconCopyright/>
            </Box>
          </Box>
        </Fade>
      </Box>
    </>
  );
}
