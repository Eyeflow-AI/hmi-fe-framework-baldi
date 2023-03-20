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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


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
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 1,
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

  const { t } = useTranslation();

  const startDate = new Date();
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(startDate.setHours(startDate.getHours() - 24)));
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const [loadingSearch, setLoadingSearch] = useState(true);


  const startSearch = () => {
    setLoadingSearch(true);
  }


  return (
    <>
      <AppBar />
      <Box sx={styleSx.filterBox}>
        <Box
          sx={{
            marginLeft: 1
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={selectedStartDate}
              onChange={setSelectedStartDate}
              label={t('Start Date')}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={selectedEndDate}
              onChange={setSelectedEndDate}
              label={t('End Date')}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>

        <Box
          sx={{
            marginLeft: 'auto',
            marginRight: 1
          }}
        >
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={startSearch}
            disabled={loadingSearch}
          >
            {t('search')}
          </Button>
        </Box>
      </Box>
      <Box sx={styleSx.dataBox}>
        TODO: Dashboard
      </Box>
    </>
  );
}
