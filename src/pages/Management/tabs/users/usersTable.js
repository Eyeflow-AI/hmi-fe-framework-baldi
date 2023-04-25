// React
import React, { useMemo, useState } from 'react';


// Design
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

// Internal
import Select from '../../../../components/Select'
import PasswordTextField from '../../../../components/PasswordTextField';

// Third-Party
import { useTranslation } from "react-i18next";
//-----------------------------------------------------------------------------------------------------

function getInvalidCharacters(username) {

  let invalidCharacterList = [];
  if (username) {
    const regex = new RegExp(/^[a-zA-Z0-9]+$/);
    [...username].forEach((character) => {
      if (!regex.test(character)) {
        invalidCharacterList.push(character);
      }
    })
  }

  return invalidCharacterList;
};

const usernameMinLength = 3;
const usernameMaxLength = 20;

function RolesBox({
  rowParams
  , rolesOptions
  , onChangeUserRole
  , userUsername }) {


  let value = rowParams?.row?.role ?? '';
  const disabled = rowParams?.row?.username === userUsername;

  return (
    <Box
      sx={{
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Select title='' disabled={disabled} value={value} setValue={onChangeUserRole} choices={rolesOptions} />
    </Box>
  )
};

function ActionsCell({
  rowParams
  , onClickDelete
  , userUsername
  , onClickResetPassword
  , deleteLoading
  , resetPasswordLoading
}) {

  const disabled = rowParams?.row?.username === userUsername;
  return (
    <>
      {
        deleteLoading ?
          <CircularProgress size={20} />
          :
          <IconButton disabled={disabled} onClick={onClickDelete} aria-label="delete" size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
      }
      {
        resetPasswordLoading ?
          <CircularProgress size={20} />
          :
          <IconButton disabled={disabled} onClick={onClickResetPassword} aria-label="reset-password" size="small">
            <RestartAltIcon fontSize="small" />
          </IconButton>
      }
    </>
  )
};
export default function UsersTable({
  userUsername
  , userList
  , accessControlData
  , deleteUser
  , changeUserRole
  , resetPassword
  , createUser
}) {


  const { t } = useTranslation();
  const rolesOptions = useMemo(() => Object.keys(accessControlData?.roles ?? {}), [accessControlData]);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [createUserLoading, setCreateUserLoading] = useState(false);


  const usernameError = useMemo(() => {
    if (username) {
      let invalidCharacterList = getInvalidCharacters(username);
      if (invalidCharacterList.length > 0) {
        return `Invalid characters: ${JSON.stringify(invalidCharacterList)}`;
      };
      if (username.length < usernameMinLength || username.length > usernameMaxLength) {
        return `Username length should be between ${usernameMinLength} and ${usernameMaxLength}`;
      };
    };
    return ''
  }, [username]);

  const addDisabled = useMemo(() => Boolean(!username || usernameError), [username, usernameError]);

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleAdd();
    };
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleAdd = () => {
    if (!addDisabled) {
      setCreateUserLoading(true);
      createUser(username, password)
        .then((result) => {
          if (result?.ok) {
            setUsername('');
            setPassword('');
          };
        })
        .finally(() => setCreateUserLoading(false));
    };
  };



  const rows = useMemo(() => {
    return userList.map((user, index) => {
      return {
        index,
        id: user._id,
        username: user.auth.username,
        creationDate: user.creationDate,
        role: user.auth.role,
        data: user,
      };
    });
  }, [userList]);

  const onClickDelete = (rowParms) => (e) => {
    setDeleteLoading(true);
    e.stopPropagation();
    let username = rowParms?.row?.username;
    if (username) {
      deleteUser(username);
    }
    setDeleteLoading(false);
  };

  const onClickResetPassword = (rowParms) => (e) => {
    setResetPasswordLoading(true);
    e.stopPropagation();
    let username = rowParms?.row?.username;
    if (username) {
      resetPassword(username);
    }
    setResetPasswordLoading(false);
  };

  const onChangeUserRole = (rowParms) => (newValue) => {
    let username = rowParms?.row?.username;
    let roleTypePermissions = accessControlData?.roles?.[newValue] ?? [];
    let roleTypes = accessControlData?.types ?? [];
    let newAccessControl = {};
    roleTypes.forEach((role) => {
      newAccessControl[role] = roleTypePermissions.includes(role);
    });

    if (username) {
      changeUserRole(username, newValue);
    }
  };

  const columns = [
    { field: 'id', headerName: t('ID'), width: 220 },
    { field: 'username', headerName: t('Username'), width: 130 },
    { field: 'creationDate', headerName: t('Creation Date'), width: 200 },
    // { field: 'role', headerName: 'Role', width: 150 },
    {
      field: "role",
      headerName: t("Role"),
      sortable: true,
      width: 200,
      renderCell: (params) => <RolesBox rowParams={params} userUsername={userUsername} rolesOptions={rolesOptions} onChangeUserRole={onChangeUserRole(params)} />
    },
    {
      field: "action",
      headerName: t("Actions"),
      sortable: false,
      renderCell: (params) => <ActionsCell
        rowParams={params}
        userUsername={userUsername}
        onClickDelete={onClickDelete(params)}
        onClickResetPassword={onClickResetPassword(params)}
        deleteLoading={deleteLoading}
        resetPasswordLoading={resetPasswordLoading}
      />
    },
  ];

  return (
    <Box sx={{
      height: 'calc(100% - 100px)',
      width: '100%',
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={62}
        disableSelectionOnClick
      />

      <Box sx={{
        height: 80,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <TextField
          id="new-user-textfield"
          label={t("Username")}
          value={username}
          onChange={handleChangeUsername}
          onKeyDown={onKeyDown}
          sx={{ marginRight: 1 }}
        />
        <PasswordTextField
          id="new-user-password"
          name="password"
          label={t("Password")}
          type="password"
          autoComplete="off"
          onChange={handleChangePassword}
          sx={{ marginRight: 1 }}
        />
        <Tooltip title={usernameError}>
          {
            createUserLoading ?
              <CircularProgress size={24} />
              :
              <span>
                <Button onClick={handleAdd} variant='contained' disabled={addDisabled}>
                  <AddIcon />
                </Button>
              </span>
          }
        </Tooltip>
      </Box>
    </Box>
  );
};
