// React
import React, { useEffect, useState } from 'react';

// Design
import { Box, List, ListItemButton, Tooltip, Typography } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';

// Third-party
import ReactJSONViewer from 'react-json-viewer';
import { useTranslation } from "react-i18next";


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

export default function Query({ pageOptions }) {

  const { t } = useTranslation();

  const [queryData, setQueryData] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState('');


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
            Query Editor
            <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                height: '100px',
                width: '100%',
              }}
            >
              toolbar:
              collection_name
              search_method
              chart:(
              type
              title
              localeId
              x_axis
              y_axis
              width
              height
              colors_result
              )
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexGrow: 1,
                height: 'calc(100% - 100px)',
                width: '100%',
              }}
            >
              {
                JSON.stringify(queryData?.[selectedQuery])
              }
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


