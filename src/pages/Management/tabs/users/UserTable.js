// React
import React, { useMemo, useState } from 'react';


// Design
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CircularProgress from '@mui/material/CircularProgress';


// Internal
import Select from '../../../../components/Select'

// Third-Party
import { useTranslation } from "react-i18next";
//-----------------------------------------------------------------------------------------------------

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
export default function UserTable({
  userUsername
  , userList
  , accessControlData
  , deleteUser
  , changeUserRole
  , resetPassword }) {


  const { t } = useTranslation();
  const rolesOptions = useMemo(() => Object.keys(accessControlData?.roles ?? {}), [accessControlData]);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

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
      height: '100%',
      width: '100%',
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={62}
        disableSelectionOnClick
      />
    </Box>
  );
};
