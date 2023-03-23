// React
import React, { useState, createElement } from 'react';

// Design
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import * as Icons from '@mui/icons-material';

// Internal
import AppBar from '../../components/AppBar';

// Third-party
import { useTranslation } from "react-i18next";
import { Card, Grid } from '@mui/material';


const APPBAR_HEIGHT = window.app_config.components.AppBar.height;
const FILTER_HEIGHT = window.app_config.components.FilterBar.height;

const styleSx = {
  dataBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    display: 'flex',
    flexGrow: 1,
    margin: '10px 10px 0 10px',
    // marginLeft: 1,
    height: `calc(100vh - ${APPBAR_HEIGHT}px - 15px)`,
  }),
};


export default function Tools() {

  const { t } = useTranslation();

  const TOOLS = window?.app_config?.tools ?? {};

  const createElementIcon = (icon) => {
    return createElement(
      Icons[icon],
      { sx: { fontSize: '80px' } }
    )
  }

  return (
    <>
      <AppBar />
      <Box sx={styleSx.dataBox}>
        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {
            Object.keys(TOOLS).map((tool) => (
              <Grid item key={`${tool}-tool`}>
                <Button
                  variant='contained'
                  sx={{
                    width: '200px',
                    height: '200px'
                  }}
                >
                  <Box>
                    <Box>
                      {
                        TOOLS[tool].icon ? createElementIcon(TOOLS[tool].icon) : null
                      }
                    </Box>
                    <Box
                      sx={{
                        fontSize: '15px'
                      }}
                    >
                      {t(TOOLS[tool].label)}
                    </Box>
                  </Box>
                </Button>
              </Grid>
            ))
          }
        </Grid>
      </Box>
    </>
  );
}
