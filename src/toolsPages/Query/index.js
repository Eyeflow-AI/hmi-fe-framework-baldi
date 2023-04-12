// React
import React from 'react';

// Design
import Box from '@mui/material/Box';

// Internal
import PageWrapper from '../../components/PageWrapper';
import { Tooltip } from '@mui/material';

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
            }}
          >
            <Box>
              Default Queries
            </Box>
            <Box>
              Custom Queries
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
            }}
          >
            Query Editor
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: '100%',
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


