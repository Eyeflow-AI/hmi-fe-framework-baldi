// React
import React, { useEffect, useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { CircularProgress, Typography } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';

// Third-party
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Bar from '../../components/Charts/Bar';

const charts = {
  bar: (chart) => <Bar chart={chart} />,
}

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


export default function Report({ pageOptions }) {

  const { t } = useTranslation();

  const { _id: stationId } = GetSelectedStation();

  const startDate = new Date();
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(startDate.setHours(startDate.getHours() - 24)));
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [builtChats, setBuiltChats] = useState([]);

  const getData = async () => {
    const charts = pageOptions?.options?.charts ?? [];
    const chartsToBuild = [];
    for (let i = 0; i < charts.length; i++) {
      // setLoadingSearch(true);
      try {
        let data = await API.get.queryData({ startTime: selectedStartDate, endTime: selectedEndDate, queryName: charts[i].query_name, stationId }, setLoadingSearch);
        // console.log(data);

        chartsToBuild.push(data);
      }
      catch (err) {
        console.error(err);
      }
    }
    setBuiltChats(chartsToBuild);
  };

  const startSearch = () => {
    getData();
  }

  useEffect(() => {

  }, []);


  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOptions]);

  return (
    <PageWrapper>
      {({ width, height }) =>
        <Box display="flex" flexDirection="column" width={width} height={height} gap={1}>
          <Box 
          height={FILTER_HEIGHT}
           width={width} 
           sx={styleSx.filterBox}
           >
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  value={selectedStartDate}
                  onChange={setSelectedStartDate}
                  label={t('start_date')}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  value={selectedEndDate}
                  onChange={setSelectedEndDate}
                  label={t('end_date')}
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
              {
                loadingSearch ?
                  <CircularProgress />
                  :

                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={startSearch}
                    disabled={loadingSearch}
                  >
                    {t('search')}
                  </Button>
              }
            </Box>
          </Box>
          {/* TODO: Dashboard <br />
            * Anomalies Evolution (line)<br />
            * Anomalies Counting (bar)<br />
            * Parts Counting ok/nok (bar)<br />
            * Top 10 anomalies (table)<br />
            * Parts ok/nok evolution (line)<br />
            * */}
          <Box 
          width={width} 
          height={height - FILTER_HEIGHT - 30} 
          sx={styleSx.dataBox}
          >
            {
              loadingSearch ?
                <Box
                  display={'flex'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress
                    size='200px'
                  />
                </Box>
                :
                (
                  builtChats.length === 0 ?
                    <Box
                      display={'flex'}
                      sx={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        textTransform={'uppercase'}
                        variant='h3'>
                        {t('no_data_to_show')}
                      </Typography>
                    </Box>
                    :
                    builtChats.map((chart, index) => charts[chart.chartInfo.type](chart))
                )
            }
          </Box>
        </Box>
      }
    </PageWrapper>
  );
}


// builtChats.map((chart, index) => {
                      
//   return (
//     <Bar
//       key={`chart-${index}`}
//       chart={chart}
//     />
//   )
// })