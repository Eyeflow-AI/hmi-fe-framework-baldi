// React
import React, { useState, useMemo } from 'react';

// Design
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

// Internal
import PasswordTextField from '../../../../components/PasswordTextField';


// Third-Party
import { useTranslation } from "react-i18next";

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
export default function Toolbar({ createUser }) {


  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      createUser(username, password)
        .then((result) => {
          if (result?.ok) {
            setUsername('');
            setPassword('');
          };
        });
    };
  };

  return (
    <Box sx={{
      height: '100%',
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
        <span>
          <Button onClick={handleAdd} variant='contained' disabled={addDisabled}>
            <AddIcon />
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};
