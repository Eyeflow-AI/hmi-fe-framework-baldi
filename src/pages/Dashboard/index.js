import React from 'react'


import Box from '@mui/material/Box';


import AppBar from '../../components/AppBar';

const APPBAR_HEIGHT = window.app_config.components.AppBar.height;
const FILTER_HEIGHT = window.app_config.components.FilterBar.height;

const styleSx = {
  filterBox: Object.assign({}, window.app_config.style.box, {
    display: 'flex',
    width: 'calc(100% - 20px)',
    margin: '0 10px 0 10px',
    height: FILTER_HEIGHT,
    // padding: 1,
    overflow: 'hidden',
    bgcolor: 'white',
  }),
  dataBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'white',
    display: 'flex',
    flexGrow: 1,
    margin: '10px 10px 0 10px',
    // marginLeft: 1,
    height: `calc(100vh - ${APPBAR_HEIGHT}px - 15px - 80px)`,
  }),
};


export default function Dashboard() {


  return (
    <>
      <AppBar />
      <Box sx={styleSx.filterBox}>
        TODO: Query Box
      </Box>
      <Box sx={styleSx.dataBox}>
        TODO: Dashboard
      </Box>
    </>
  );
}
