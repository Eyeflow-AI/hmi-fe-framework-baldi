// React
import React, { useEffect, useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';

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

  const { _id: stationId } = GetSelectedStation();

  const startDate = new Date();
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(startDate.setHours(startDate.getHours() - 24)));
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const [loadingSearch, setLoadingSearch] = useState(true);


  const startSearch = () => {
    setLoadingSearch(true);
  }
  console.log({ pageOptions })

  const getData = () => {
    // setLoadingSearch(true);
    // API.get.data({ query: { startDate: selectedStartDate, endDate: selectedEndDate, query }, stationId }, setLoadingSearch)
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch(console.error)
    //   .finally(() => {
    //     setLoadingSearch(false);
    //   });
  }

  useEffect(() => {

  }, []);


  useEffect(() => {
    if (Object.keys(pageOptions?.options?.charts).length > 0) {
      const charts = pageOptions?.options?.charts ?? {};
      const totalCharts = Object.keys(charts).length;
      const totalBoxes = 8;
      let chartsToDisplay = [];
      if (totalCharts > totalBoxes) {
        console.error('Impossible to show all charts');
      }
      else if (totalCharts === totalBoxes) {
        const chartsPerBox = 1;
        let occupiedBoxes = 0;
        while (occupiedBoxes < totalBoxes) {
          Object.entries(charts).forEach(([chartName, chartInfo]) => {
            if (occupiedBoxes < totalBoxes) {
              chartsToDisplay.push({ chartName, chartInfo });
            }
          })
          occupiedBoxes += chartsPerBox;
        }

      }
    }
    // dividir a quantidade de gráficos pela quantidade de caixas(2)
    // para saber quantos gráficos por caixa
    // somar o máximo e o mínimo para pegar o tamanho exato


  }, [pageOptions]);

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
          {/* TODO: Dashboard <br />
            * Anomalies Evolution (line)<br />
            * Anomalies Counting (bar)<br />
            * Parts Counting ok/nok (bar)<br />
            * Top 10 anomalies (table)<br />
            * Parts ok/nok evolution (line)<br />
            * */}
          <Box width={width} sx={styleSx.dataBox}>
            <Grid container justifyContent='space-between'>
              <Grid item xs={6}>
                1
              </Grid>
              <Grid item xs={6}>
                2
              </Grid>
              <Grid item xs={6}>
                3
              </Grid>
              <Grid item xs={6}>
                4
              </Grid>
            </Grid>
          </Box>
        </Box>
      }
    </PageWrapper>
  );
}
