// React
import React, { useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';


// Internal
import AppBar from '../../components/AppBar';

// Third-party
import { useTranslation } from "react-i18next";


const APPBAR_HEIGHT = window.app_config.components.AppBar.height;
const FILTER_HEIGHT = window.app_config.components.FilterBar.height;

const styleSx = {
  dataBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    display: 'flex',
    flexGrow: 1,
    margin: '10px 10px 0 10px',
    // marginLeft: 1,
    height: `calc(100vh - ${APPBAR_HEIGHT}px - 15px - 80px)`,
  }),
};


export default function Tools() {

  const { t } = useTranslation();


  return (
    <>
      <AppBar />
      <Box sx={styleSx.dataBox}>
        TODO: Tools
      </Box>
    </>
  );
}
