// React
import React, { useState, useEffect } from 'react';

// Design
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


// Internal
import { getUserUsername } from '../../store/slices/auth';
import AppWrapper from '../../components/AppWrapper.js';
import API from '../../api';
import PasswordTextField from '../../components/PasswordTextField';
import UserTable from './UserTable';
import Toolbar from './Toolbar';


// Third-Party
import { useTranslation } from "react-i18next";

//-----------------------------------------------------------------------------------------------------

export default function UserManagement() {

  const { t } = useTranslation();

  const userUsername = useSelector(getUserUsername);

  const [accessControlData, setAccessControlData] = useState(null);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState('');
  const [userList, setUserList] = useState([]);

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const getAccessControlData = () => {
    API.getAccessControlData()
      .then((data) => setAccessControlData(data?.data))
      .catch(console.log);
  };

  const getUserList = () => {
    API.getUserList()
      .then((data) => setUserList(data?.userList ?? []))
      .catch(console.log);
  };

  const createUser = (username, password) => {
    return API.createUser({ username, password })
      .then((result) => {
        // console.log(result);
        getUserList();
        return { ok: true };
      })
      .catch(console.log);
  };

  const deleteUser = (username) => {
    API.deleteUser({ username })
      .then((result) => {
        // console.log(result);
        getUserList();
      })
      .catch(console.log)
  };
  const resetPassword = (username, newPassword) => {
    API.resetPassword({ username, newPassword })
      .then((result) => {
        // console.log(result);
        getUserList();
      })
      .catch(console.log)
      .finally(() => setOpenResetPasswordDialog(''))
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleChangePassword2 = (event) => {
    setPassword2(event.target.value);
  };

  const changeUserRole = (username, accessControl, newRole) => {
    API.changeUserRole({ username, accessControl, newRole })
      .then((result) => {
        console.log(result);
        getUserList();
      })
      .catch(console.log);
  };

  useEffect(() => {
    getAccessControlData();
    getUserList();
    // eslint-disable-next-line
  }, []);

  return (
    <AppWrapper>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '4px',
          boxShadow: 1,
          width: '100%',
          height: '100%',
        }}
      >
        <Box sx={{ height: 'calc(100vh - 170px)' }}>
          <UserTable
            userUsername={userUsername}
            userList={userList}
            accessControlData={accessControlData}
            deleteUser={deleteUser}
            resetPassword={setOpenResetPasswordDialog}
            changeUserRole={changeUserRole}
          />
        </Box>
        <Box sx={{ height: 80 }}>
          <Toolbar createUser={createUser} />
        </Box>
      </Box>
      <Dialog
        open={Boolean(openResetPasswordDialog)}
        onClose={() => setOpenResetPasswordDialog('')}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`${t("Reset Password")} (${openResetPasswordDialog})`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <PasswordTextField
              id="new-user-password"
              name="password"
              label={t("Password")}
              type="password"
              autoComplete="off"
              onChange={handleChangePassword}
              sx={{ marginRight: 1 }}
            />
            <PasswordTextField
              id="new-user-password"
              name="password"
              label={t("Confirm Password")}
              type="password"
              autoComplete="off"
              onChange={handleChangePassword2}
              sx={{ marginRight: 1 }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetPasswordDialog('')}>{t('Cancel')}</Button>
          <Button
            onClick={() => resetPassword(openResetPasswordDialog, password)}
            disabled={!password || !password2 || password !== password2}
          >
            {t('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </AppWrapper >
  );
};