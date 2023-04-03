// React
import React, { useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


// Internal
import PageWrapper from '../../components/PageWrapper';
import ComponentBuilder from './componentBuilder';

// Third-party
import { useTranslation } from "react-i18next";
import { colors } from 'sdk-fe-eyeflow';


const styleSx = {
  mainBox: {
    // bgcolor: 'background.paper',
    display: 'flex',
    gap: 0.1
  },
  buttonsBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    display: 'flex',
    width: '150px',
    justifyContent: 'center',
    paddingTop: '4px'
  }),
  dataBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    display: 'flex',
    flexGrow: 1,
    marginLeft: 1,
  }),
  buttons: {
    width: '140px',
    backgroundColor: 'white',
    border: `${colors.eyeflow.blue.dark} 1px solid`,
  }
};


export default function Management({ pageOptions }) {

  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('general');

  const TABS = window.app_config.pages.Management.options.tabs ?? [];

  return (
    <PageWrapper>
      {({ width, height }) =>
        <Box width={width} height={height} sx={styleSx.mainBox}>
          <Box sx={styleSx.buttonsBox}>
            <Stack spacing={0.5}>
              {
                TABS.map(tab => (
                  <Button
                    key={`button-${tab.name}`}
                    sx={{
                      ...styleSx.buttons,
                      backgroundColor: selectedTab === tab.name ? colors.eyeflow.blue.medium : "white",
                      color: selectedTab !== tab.name ? colors.eyeflow.blue.dark : "white"
                    }}
                    onClick={() => setSelectedTab(tab.name)}
                  >
                    <Stack>
                      <img
                        alt=""
                        src={tab.icon}
                        style={{
                          height: '50px'
                        }}
                      />
                      {t(tab.name)}
                    </Stack>
                  </Button>
                ))
              }
            </Stack>
          </Box>
          <Box sx={styleSx.dataBox}>
            <ComponentBuilder tab={selectedTab} />
          </Box>
        </Box>
      }
    </PageWrapper>
  );
}
