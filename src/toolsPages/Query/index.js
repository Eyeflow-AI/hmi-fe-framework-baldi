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
  , Select,
  Stack
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FolderIcon from '@mui/icons-material/Folder';
import InputAdornment from '@mui/material/InputAdornment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';

// Third-party
import ReactJSONViewer from 'react-json-viewer';
import { useTranslation } from "react-i18next";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    display: 'flex',
    flexGrow: 1,
  }),
};

var jsonData = [{
  "task": "Write Book",
  "done": false
}, {
  "task": "Learn React",
  "done": true
}, {
  "task": "Buy Mobile",
  "done": false
}];

const SEARCH_METHODS = [
  {
    method: 'find',
  },
  {
    method: 'aggregate',
  },
  {
    method: 'count',
  },
  // {
  //   method: 'distinct',
  // },
  {
    method: 'estimatedDocumentCount',
  },
  {
    method: 'findOne',
  },
  // {
  //   method: 'findOneAndDelete',
  // },
  // {
  //   method: 'findOneAndRemove',
  // },
  // {
  //   method: 'findOneAndReplace',
  // },
  // {
  //   method: 'findOneAndUpdate',
  // },
  // {
  //   method: 'insertMany',
  // },
  // {
  //   method: 'insertOne',
  // },
  // {
  //   method: 'replaceOne',
  // },
  // {
  //   method: 'updateMany',
  // },
  // {
  //   method: 'updateOne',
]

export default function Query({ pageOptions }) {

  const { t } = useTranslation();

  const [queryData, setQueryData] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState('');
  const [searchMethod, setSearchMethod] = useState('');

  const getData = () => {
    API.get.query({})
      .then(res => {
        console.log(res);
        setQueryData(res?.result ?? [])
      })
      .finally(() => {
      });
  }

  useEffect(() => {
    getData();
  }, []);


  const saveQuery = () => {
    console.log('saveQuery');
  }

  const handleSearchMethodChange = (event) => {
    setSearchMethod(event.target.value);
  };

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
                height: 'calc(100% - 30px)',
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
              </List>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: '100%',
              width: 'calc(100% - 250px)',
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
                  minWidth: 200,
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
                    SEARCH_METHODS.map((method, index) => {
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
                height: 'calc(100% - 100px)',
                width: '100%',
              }}
            >

              <JSONInput
                id='a_unique_id'
                placeholder={queryData?.[selectedQuery] ?? {}}
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
                    onClick={saveQuery}
                    variant='contained'
                    startIcon={<DeleteIcon />}
                    color='error'
                  >
                    {t('delete')}
                  </Button>
                  <Button
                    onClick={saveQuery}
                    variant='contained'
                    startIcon={<SaveIcon />}
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
                    onClick={saveQuery}
                    variant='contained'
                    startIcon={<PlayArrowIcon />}
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
              width: 'calc(100% - 250px)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '80px',
                overflow: 'hidden',
              }}
            >
              <Tooltip title={t('csv_view')}>
                <img
                  src={`${window.app_config.hosts['hmi-files-ws'].url}/fontawesome/svgs/solid/file-csv.svg`}
                  alt={t('csv_view')}
                />
              </Tooltip>

              <Tooltip title={t('json_view')}>
                <img
                  src={`${window.app_config.hosts['hmi-files-ws'].url}/mui/icons/data_object_24px.svg`}
                  alt={t('json_view')}
                />
              </Tooltip>

              <Tooltip title={t('table_view')}>
                <img
                  src={`${window.app_config.hosts['hmi-files-ws'].url}/fontawesome/svgs/solid/table.svg`}
                  alt={t('table_view')}
                />
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
              <ReactJSONViewer
                json={jsonData}
              />
            </Box>
          </Box>
        </Box>
      }
    </PageWrapper>
  )
}


