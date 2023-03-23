// React
import React, { useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


// Internal
import AppBar from '../../components/AppBar';

// Third-party
import { useTranslation } from "react-i18next";
import { colors } from 'sdk-fe-eyeflow';

const APPBAR_HEIGHT = window.app_config.components.AppBar.height;
const FILTER_HEIGHT = window.app_config.components.FilterBar.height;

const styleSx = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    // bgcolor: 'white',
    display: 'flex',
    flexGrow: 1,
    // flexDirection: 'column',
    margin: '10px 10px 0 10px',
    // marginLeft: 1,
    height: `calc(100vh - ${APPBAR_HEIGHT}px - 15px)`,
    gap: 0.1
  }),
  buttonsBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    display: 'flex',
    flexGrow: 1,
    height: `calc(100vh - ${APPBAR_HEIGHT}px - 15px)`,
    width: '150px',
    justifyContent: 'center',
    paddingTop: '4px'
  }),
  dataBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    display: 'flex',
    flexGrow: 1,
    marginLeft: 1,
    height: `calc(100vh - ${APPBAR_HEIGHT}px - 15px)`,
    width: 'calc(100% - 150px)',
  }),
  buttons: {
    width: '140px',
    backgroundColor: 'white',
    border: `${colors.eyeflow.blue.dark} 1px solid`,
  }
};


export default function Management() {

  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('general');

  const TABS = [
    'general'
    , 'users'
    , 'alarms'
  ]

  return (
    <>
      <AppBar />
      <Box sx={styleSx.mainBox}>
        <Box sx={styleSx.buttonsBox}>
          <Stack spacing={0.5}>
            {
              TABS.map(tab => (
                <Button
                  key={`button-${tab}`}
                  sx={{
                    ...styleSx.buttons,
                    backgroundColor: selectedTab === tab ? colors.eyeflow.blue.medium : "white",
                    color: selectedTab !== tab ? colors.eyeflow.blue.dark : "white"
                  }}
                  onClick={() => setSelectedTab(tab)}
                >
                  {t(tab)}
                </Button>
              ))
            }
          </Stack>
        </Box>
        <Box sx={styleSx.dataBox}>
          {selectedTab}
        </Box>
      </Box>
    </>
  );
}
