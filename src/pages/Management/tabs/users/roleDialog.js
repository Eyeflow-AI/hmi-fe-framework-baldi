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
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';


// Internal
import API from '../../../../api';

// Third-Party
import { useTranslation } from "react-i18next";

export default function RoleDialog({
  open
  , onClose
  , title
  , types
  , roles
  , getAccessControlData
  , selectedRoleInfo = null
}) {
  console.log({ selectedRoleInfo })

  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleTypes, setRoleTypes] = useState([]);
  const [roleNameError, setRoleNameError] = useState(false);

  const handleClose = () => {
    setRoleName('');
    setDescription('');
    setRoleTypes([]);
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
          handleClose();
        });
    }
  };

  const handleEditRole = () => {
    if (roleName && !roleNameError) {
      API.put.role({
        oldRoleName: selectedRoleInfo.role,
        roleName,
        description,
        types: roleTypes
      }).then(() => { })
        .catch(console.log)
        .finally(() => {
          handleClose();
        });
    }
  };
  const handleDeleteRole = () => {
    console.log({ roleName })
    if (roleName) {
      API.delete.role({
        roleName
      }).then(() => { })
        .catch(console.log)
        .finally(() => {
          handleClose();
        });
    };
  };



  const handleWayToSave = () => {
    if (title === t('create_role')) {
      handleCreateRole();
    }
    else if (title === t('edit_role')) {
      handleEditRole();
    }
  };

  const handleTypesSelection = (value, index) => {
    let newRoleTypes = [...roleTypes];
    if (roleTypes.includes(value.type)) {
      newRoleTypes = newRoleTypes.filter((type) => type !== value.type)
    }
    else {
      newRoleTypes.push(value.type);
    }
    if (newRoleTypes.includes('master')) newRoleTypes = ['master'];
    setRoleTypes(newRoleTypes);
  };

  useEffect(() => {
    if (roleName && title === t('create_role')) {
      setRoleNameError(roles?.includes(roleName));
    }
    let rolename = roleName.replace(/\./g, '');
    setRoleName(rolename);
  }, [roleName, roles]);

  useEffect(() => {
    if (selectedRoleInfo) {
      setRoleName(selectedRoleInfo.role);
      setDescription(selectedRoleInfo.description);
      setRoleTypes(selectedRoleInfo.types);
    }
  }, [selectedRoleInfo]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
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
                    disabled={roleTypes.includes('master') && typeInfo.type !== 'master'}
                  />}
                label={t(typeInfo.type)}
              />
            ))
          }
        </FormGroup>
      </DialogContent>
      <DialogActions>
        {
          title === t('edit_role') && selectedRoleInfo.deletable &&
          <Button
            onClick={handleDeleteRole}
            variant='contained'
            startIcon={<DeleteIcon />}
            disabled={title !== t('edit_role')}
            color='error'
          >
            {t('delete')}
          </Button>
        }
        <Button
          onClick={handleClose}
          variant='contained'
          startIcon={<CloseIcon />}
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={handleWayToSave}
          variant='contained'
          disabled={!roleName || !description || !roleTypes.length || roleNameError}
          startIcon={<SaveIcon />}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
