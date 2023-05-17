// React
import React, { useEffect, useState } from 'react';

// Design
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  Button
  , TextField
  , InputAdornment
  , FormControl
  , InputLabel
  , Select
  , MenuItem
  , CircularProgress
  , Box
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';


// Internal
import { setNotificationBar } from '../../store/slices/app';


// Third-party
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { copyToClipboard } from 'sdk-fe-eyeflow';
import API from '../../api';

export default function AddQueryDialog({ open, setOpen, pageOptions, existingQueries }) {


  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [collectionName, setCollectionName] = useState('');
  const [searchMethod, setSearchMethod] = useState('');
  const [queryName, setQueryName] = useState('');
  const [queryNameAlreadyExists, setQueryNameAlreadyExists] = useState(false);

  const [addingLoading, setAddingLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };


  const handleSearchMethodChange = (event) => {
    setSearchMethod(event.target.value);
  };

  const handleAddQuery = () => {
    setAddingLoading(true);
    const searchMethodFormat = pageOptions?.options?.expectedValuesFormats?.find((method) => method.type === searchMethod)?.format;
    if (searchMethod && searchMethodFormat && collectionName && queryName) {
      API.post.addQuery({
        collectionName,
        searchMethod,
        queryName,
        query: searchMethodFormat,
      })
        .then((response) => {
          dispatch(setNotificationBar({
            message: t('query_added'),
            type: 'success',
            show: true,
          }));
        })
        .catch((error) => {
          dispatch(setNotificationBar({
            message: t('error_adding_query'),
            type: 'error',
            show: true,
          }));
        })
        .finally(() => {
          setQueryName('');
          setCollectionName('');
          setSearchMethod('');
          setAddingLoading(false);
          handleClose();
        })
    }
    else {
      setAddingLoading(false);
    }
    console.log({ collectionName, searchMethod, queryName, searchMethodFormat });
  }

  useEffect(() => {
    if (queryName) {
      setQueryNameAlreadyExists(existingQueries?.includes(queryName));
    }
  }, [queryName])


  return (
    <Dialog
      onClose={handleClose}
      open={open}
    >
      <DialogTitle
        textAlign={'center'}
      >
        {t('add_query')}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          id="query-name"
          label={t('query_name')}
          variant="outlined"
          value={queryName}
          onChange={(event) => setQueryName(event.target.value)}
          fullWidth
          sx={{
            marginTop: 1.5
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FolderIcon />
              </InputAdornment>
            ),
          }}
          error={queryNameAlreadyExists}
          helperText={queryNameAlreadyExists && t('query_name_already_exists')}
        />
        <TextField
          id="collection-name"
          label={t('collection_name')}
          variant="outlined"
          value={collectionName}
          onChange={(event) => setCollectionName(event.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FolderIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl
          fullWidth
        >
          <InputLabel id="search-method-input-label">{t('search_method')}</InputLabel>
          <Select
            labelId="search-method-select"
            id="demo-simple-select"
            value={searchMethod}
            label={t('search_method')}
            onChange={handleSearchMethodChange}
          >
            {
              pageOptions?.options?.searchMethods?.map((method, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={method.method}
                  >
                    {method.method}
                  </MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>

        <Button
          onClick={handleClose}
          variant="contained"
        >
          {t('cancel')}
        </Button>
        {
          addingLoading ?
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100px'
              }}
            >
              <CircularProgress
                size={30}
              />
            </Box>
            :

            <Button
              variant="contained"
              disabled={!queryName || !collectionName || !searchMethod || queryNameAlreadyExists}
              onClick={handleAddQuery}
            >
              {t('add')}
            </Button>
        }
      </DialogActions>
    </Dialog>
  );
}