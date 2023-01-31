import React from 'react'


import Box from '@mui/material/Box';


import AppBar from '../../components/AppBar';
import EventMenuList from '../../components/EventMenuList';


const APPBAR_HEIGHT = window.app_config.components.AppBar.height;
console.log({APPBAR_HEIGHT})

const styleSx = {
  mainBox: {
    display: 'flex',
    width: 'calc(100vw)',
    height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
    padding: 1,
    overflow: 'hidden',
  },
  eventMenuBox: Object.assign({}, window.app_config.style.box, {
    width: 200,
    bgcolor: 'white',
    borderRadius: 2,
  }),
  dataBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    display: 'flex',
    flexGrow: 1,
    marginLeft: 1
  }),
};


export default function Monitor() {


  return (
    <>
      <AppBar />
      <Box id="monitor-main-box" sx={styleSx.mainBox}>
        <Box id="monitor-event-menu-box" sx={styleSx.eventMenuBox}>
          Menu
        </Box>
        <Box id="monitor-data-box" sx={styleSx.dataBox}>
          Data
        </Box>
      </Box>
    </>
  );
}
