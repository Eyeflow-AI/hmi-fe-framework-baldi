// React
import React, { useEffect, useState } from 'react';

// Design

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

// Internal
import API from '../../../../api';

// Third-Party
import { useTranslation } from "react-i18next";

export default function CreateRoleDialog({
  open,
  onClose,
  types,
  roles
  , getAccessControlData
}) {

  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleTypes, setRoleTypes] = useState([]);
  const [roleNameError, setRoleNameError] = useState(false);

  const handleClose = () => {
    getAccessControlData();
    onClose(false);
  };

  const handleCreateRole = () => {
    if (roleName && !roleNameError) {
      API.post.role({
        roleName,
        description,
        types: roleTypes
      }).then(() => { })
        .catch(console.log)
        .finally(() => {
          // setRoleName('');
          // setDescription('');
          // setRoleTypes([]);
          handleClose();
        });
    }
  };

  const handleTypesSelection = (value, index) => {
    if (roleTypes.includes(value.type)) {
      setRoleTypes(roleTypes.filter((type) => type !== value.type));
    }
    else {
      setRoleTypes([...roleTypes, value.type]);
    }
  };
  useEffect(() => {
    if (roleName) {
      setRoleNameError(roles?.includes(roleName));
      let rolename = roleName.replace(/\./g, '');
      setRoleName(rolename);
    }
  }, [roleName, roles]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{t('create_role')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t('role_name')}
          type="text"
          fullWidth
          error={roleNameError}
          helperText={roleNameError && t('cannot_repeat_role_name')}
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label={t('description')}
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormGroup>

          {
            types?.map((typeInfo, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={roleTypes.includes(typeInfo.type)}
                    onChange={(e) => handleTypesSelection(typeInfo, index)}
                  />}
                label={t(typeInfo.type)}
              />
            ))
          }
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant='contained'
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={handleCreateRole}
          variant='contained'
          disabled={!roleName || !description || !roleTypes.length || roleNameError}
        >
          {t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
