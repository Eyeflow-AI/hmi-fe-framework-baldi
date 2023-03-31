// React
import React from 'react';

// Design
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import SearchIcon from '@mui/icons-material/Search';
// import TextField from '@mui/material/TextField';


// Internal
import PageWrapper from '../../components/PageWrapper';

// Third-party
// import { useTranslation } from "react-i18next";


// const FILTER_HEIGHT = window.app_config.components.FilterBar.height;

const styleSx = {
  dataBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    display: 'flex',
  }),
};


export default function History() {

  // const { t } = useTranslation();


  return (
    <PageWrapper>
      {(width, height) =>
      <Box width={width} height={height} sx={styleSx.dataBox}>
        TODO: History
      </Box>
      }
    </PageWrapper>
  );
}
