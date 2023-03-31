// React
import React, { useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';

// Third-party
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const FILTER_HEIGHT = window.app_config.components.FilterBar.height;

const styleSx = {
  filterBox: Object.assign({}, window.app_config.style.box, {
    display: 'flex',
    paddingLeft: 1,
    overflow: 'hidden',
    bgcolor: 'background.paper',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 1,
  }),
  dataBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    display: 'flex',
    flexGrow: 1,
    padding: 1,
  }),
};


export default function Dashboard({ pageOptions }) {

  const { t } = useTranslation();

  const startDate = new Date();
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(startDate.setHours(startDate.getHours() - 24)));
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const [loadingSearch, setLoadingSearch] = useState(true);


  const startSearch = () => {
    setLoadingSearch(true);
  }


  return (
    <PageWrapper>
      {({ width, height }) =>
        <Box display="flex" flexDirection="column" width={width} height={height} gap={1}>
          <Box height={FILTER_HEIGHT} width={width} sx={styleSx.filterBox}>
            <Box>
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
          <Box width={width} sx={styleSx.dataBox}>
            {/* TODO: Dashboard <br />
            * Anomalies Evolution (line)<br />
            * Anomalies Counting (bar)<br />
            * Parts Counting ok/nok (bar)<br />
            * Top 10 anomalies (table)<br />
            * Parts ok/nok evolution (line)<br />
            * */}
            <Grid container justifyContent='space-between'>
              <Grid item xs={3}>
                1
              </Grid>
              <Grid item xs={3}>
                2
              </Grid>
              <Grid item xs={3}>
                3
              </Grid>
              <Grid item xs={3}>
                4
              </Grid>
              <Grid item xs={3}>
                5
              </Grid>
              <Grid item xs={3}>
                6
              </Grid>
              <Grid item xs={3}>
                7
              </Grid>
              <Grid item xs={3}>
                8
              </Grid>
            </Grid>
          </Box>
        </Box>
      }
    </PageWrapper>
  );
}
