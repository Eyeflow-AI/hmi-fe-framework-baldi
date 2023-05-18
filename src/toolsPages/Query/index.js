// React
import React, { useEffect, useState } from 'react';

// Design
import {
  Box
  , List
  , ListItemButton
  , Tooltip
  , Typography
  , Button
  , TextField
  , MenuItem
  , FormControl
  , InputLabel
  , Select
  , Stack
  , ListItemText
  , CircularProgress,
  IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FolderIcon from '@mui/icons-material/Folder';
import InputAdornment from '@mui/material/InputAdornment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import BackupTableRoundedIcon from '@mui/icons-material/BackupTableRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';
import ExpectedFormatsDialog from './expectedFormatsDialog';
import AddQueryDialog from './addQueryDialog';
import { setNotificationBar } from '../../store/slices/app';

// Third-party
import ReactJSONViewer from 'react-json-viewer';
import { useTranslation } from "react-i18next";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { useDispatch } from 'react-redux';

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    display: 'flex',
    flexGrow: 1,
  }),
};

// var jsonData = [{
//   "task": "Write Book",
//   "done": false
// }, {
//   "task": "Learn React",
//   "done": true
// }, {
//   "task": "Buy Mobile",
//   "done": false
// }];

export default function Query({ pageOptions }) {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [view, setView] = useState('query_view');
  const [resultView, setResultView] = useState('json');
  const [queryData, setQueryData] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState('');
  const [searchMethod, setSearchMethod] = useState('');
  const [openExpectedFormatsDialog, setOpenExpectedFormatsDialog] = useState(false);
  const [currentText, setCurrentText] = useState({});
  const [errorInText, setErrorInText] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [showAddQueryDialog, setShowAddQueryDialog] = useState(false);
  const [jsonData, setJsonData] = useState({});
  const [loadingRunQuery, setLoadingRunQuery] = useState(false);

  const getData = () => {
    API.get.query({})
      .then(res => {
        setQueryData(res?.result ?? [])
      })
      .finally(() => {
      });
  }

  const removeQuery = () => {
    if (selectedQuery) {
      API.delete.query({ queryName: selectedQuery })
        .then(res => {
          setSearchMethod('');
          setSelectedQuery('');
          setCollectionName('');
          setCurrentText({});
          dispatch(setNotificationBar({ message: t('query_removed_successfully'), type: 'success', show: true }))
          getData();
        })
        .catch(err => {
          dispatch(setNotificationBar({ message: t('failed_to_remove_query'), type: 'error', show: true }))
        })
        .finally(() => {
        });
    }
  }


  useEffect(() => {
    getData();
  }, []);

  const handleTextChange = (event) => {
    setCurrentText(event.jsObject);
    setErrorInText(!Boolean(event.jsObject));
  }
  const saveQuery = () => {
    if (selectedQuery && searchMethod && collectionName && currentText) {
      console.log({ collectionName, searchMethod, selectedQuery, currentText })

      let data = {
        queryName: selectedQuery,
        searchMethod: searchMethod,
        collectionName: collectionName,
        query: JSON.stringify(currentText),
      }
      API.put.saveQuery({ ...data })
        .then(res => {
          dispatch(setNotificationBar({ message: t('query_saved_successfully'), type: 'success', show: true }));
        })
        .catch(err => {
          dispatch(setNotificationBar({ message: t('failed_to_save_query'), type: 'error', show: true }))
        })
        .finally(() => {
        });
    }
  }

  const runQuery = () => {
    if (selectedQuery) {
      setLoadingRunQuery(true);
      API.post.runQuery({
        searchMethod: searchMethod,
        collectionName: collectionName,
        query: JSON.stringify(currentText),
      })
        .then(res => {
          let result = res?.result ?? [];
          setJsonData(result);

          dispatch(setNotificationBar({ message: t('query_run_successfully'), type: 'success', show: true }));
        })
        .catch(err => {
          dispatch(setNotificationBar({ message: t('failed_to_run_query'), type: 'error', show: true }))
        })
        .finally(() => {
          setLoadingRunQuery(false);
        });
    }
  }


  const handleSearchMethodChange = (event) => {
    setSearchMethod(event.target.value);
  };

  useEffect(() => {
    if (selectedQuery) {
      let searchMethod = queryData[selectedQuery]?.search_method ?? '';
      let collectioName = queryData[selectedQuery]?.collection_name ?? '';
      let method = {};
      if (searchMethod === 'aggregate') {
        method = {
          pipeline: queryData[selectedQuery]?.pipeline ?? [],
        }
      }
      else {
        method = {
          ...queryData[selectedQuery]?.restrictionsSet ?? {},
        }
      }
      setCollectionName(collectioName);
      setSearchMethod(searchMethod);
      setCurrentText(method);

    }
  }, [selectedQuery]);

  useEffect(() => {
    if (!showAddQueryDialog) {
      getData();
    }
  }, [showAddQueryDialog])


  console.log({ selectedQuery })

  return (
    <PageWrapper>
      {(width, height) =>
        <Box
          width={width}
          height={height}
          sx={style.mainBox}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '250px',
              height: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '95%',
                height: '100px',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 1,
                paddingLeft: 1,
                paddingRight: 1,
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={() => setView('query_view')}
                disabled={view === 'query_view'}
              >
                {t('query_view')}
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setView('collection_view')}
                // disabled={view === 'collection_view'}
                disabled={true}
              >
                {t('collection_view')}
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '30px',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography textTransform={'uppercase'}>
                {t('queries')}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: 'calc(100% - 30px - 60px)',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              {/* {JSON.stringify(Object.keys(queryData ?? {}))} */}
              <List
                sx={{
                  width: '100%',
                }}
              >
                {
                  Object.keys(queryData ?? {}).map((queryName, index) => {
                    return (
                      <ListItemButton
                        key={index}
                        onClick={() => setSelectedQuery(queryName)}
                        selected={selectedQuery === queryName}
                      >
                        {queryName}
                      </ListItemButton>
                    )
                  })
                }
                <ListItemButton
                  onClick={() => setShowAddQueryDialog(true)}
                >
                  <ListItemText
                    secondary={t('add_query')}
                  />
                </ListItemButton>
              </List>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: '100%',
              width: 'calc(50% - 250px)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                height: '100px',
                width: '100%',
                marginTop: 1
              }}
            >
              <TextField
                id="collection-name"
                label={t('collection_name')}
                variant="outlined"
                value={collectionName}
                onChange={(event) => setCollectionName(event.target.value)}
                sx={{
                  width: 150,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FolderIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl
                sx={{
                  width: 200,
                }}
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
              {/* chart:(
              type
              title
              localeId
              x_axis
              y_axis
              width
              height
              colors_result
              ) */}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                height: 'calc(100% - 200px)',
                width: '100%',
                marginBottom: 2,
              }}
            >

              <JSONInput
                id='a_unique_id'
                placeholder={currentText}
                // colors={darktheme}
                locale={locale}
                height={'100%'}
                width={'100%'}
                fontSize={50}
                waitAfterKeyPress={3000}
                style={{
                  body: {
                    fontSize: '20px',
                  }
                }}
                onChange={handleTextChange}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                <Stack direction='row' justifyContent='flex-start' gap={1}>
                  <Button
                    onClick={removeQuery}
                    variant='contained'
                    startIcon={<DeleteIcon />}
                    color='error'
                    disabled={!queryData?.[selectedQuery]?.feConfig?.deletable}
                  >
                    {t('delete')}
                  </Button>
                  <Button
                    onClick={saveQuery}
                    variant='contained'
                    startIcon={<SaveIcon />}
                    disabled={!queryData?.[selectedQuery]?.feConfig?.editable ?? errorInText}
                  >
                    {t('save')}
                  </Button>
                </Stack>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                <Stack direction="row" justifyContent='flex-end' gap={1}>
                  <Button
                    onClick={() => setOpenExpectedFormatsDialog(true)}
                    variant='contained'
                    startIcon={<LightbulbIcon />}
                    color='info'
                    sx={{
                      marginLeft: 1
                    }}
                  >
                    {t('expected_formats')}
                  </Button>
                  <Button
                    onClick={runQuery}
                    variant='contained'
                    startIcon={loadingRunQuery ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                    disabled={errorInText || collectionName === '' || searchMethod === '' || loadingRunQuery}
                    color='success'
                    sx={{
                      marginLeft: 1
                    }}
                  >
                    {t('run_query')}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: '100%',
              width: 'calc(50% - 250px)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '80px',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >

              <Tooltip title={t('json_view')}>
                <span>
                  <IconButton
                    onClick={() => setResultView('json')}
                    disabled={resultView === 'json'}
                  >
                    <DataObjectRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t('csv_view')}>
                <span>
                  <IconButton
                    onClick={() => setResultView('csv')}
                    disabled={resultView === 'csv'}
                  >
                    <AttachFileRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t('table_view')}>
                <span>
                  <IconButton
                    onClick={() => setResultView('table')}
                    disabled={resultView === 'table'}
                  >
                    <BackupTableRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: 'calc(100% - 80px)',
                overflow: 'auto',
              }}
            >

              {
                resultView === 'table' &&
                <ReactJSONViewer
                  json={jsonData.data}
                />
              }
              {
                resultView === 'json' &&
                <JSONInput
                  id='a_unique_i'
                  placeholder={jsonData}
                  // colors={darktheme}
                  locale={locale}
                  height={'100%'}
                  width={'100%'}
                  fontSize={50}
                  waitAfterKeyPress={3000}
                  style={{
                    body: {
                      fontSize: '20px',
                    }
                  }}
                  onChange={handleTextChange}
                />
              }
            </Box>
          </Box>

          <ExpectedFormatsDialog
            open={openExpectedFormatsDialog}
            setOpen={setOpenExpectedFormatsDialog}
            expectedFormats={pageOptions?.options?.expectedValuesFormats ?? []}
          />
          <AddQueryDialog
            open={showAddQueryDialog}
            setOpen={setShowAddQueryDialog}
            pageOptions={pageOptions}
            existingQueries={Object.keys(queryData ?? {})}
          />
        </Box>
      }
    </PageWrapper>
  )
}


