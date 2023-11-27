// React
import React, { useEffect, useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import getQueryDateString from '../../utils/functions/getQueryDateString';
import Clock from '../../utils/Hooks/Clock';
import { Bar, Pie, Funnel, Line } from '../../components/Charts';

// Third-party
import { useTranslation } from "react-i18next";

const charts = {
  bar: (chart) => <Bar chart={chart} key={chart?.chartInfo?.localeId} />,
  pie: (chart) => <Pie chart={chart} key={chart?.chartInfo?.localeId} />,
  funnel: (chart) => <Funnel chart={chart} key={chart?.chartInfo?.localeId} />,
  line: (chart) => <Line chart={chart} key={chart?.chartInfo?.localeId} />,
}


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
    flexWrap: 'wrap',
    flexGrow: 1,
    padding: 1,
  }),
};


export default function Dashboard({ pageOptions }) {

  const { t } = useTranslation();

  const { _id: stationId } = GetSelectedStation();
  const {clock} = Clock({sleepTime: pageOptions?.options?.getEventSleepTime ?? 60000});

  const startDate = new Date();

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [builtChats, setBuiltChats] = useState([]);

  const getData = async () => {
    const charts = pageOptions?.options?.charts ?? [];
    const chartsToBuild = [];
    for (let i = 0; i < charts.length; i++) {
      // setLoadingSearch(true);
      try {
        let data = await API.get.queryData({ startTime: getQueryDateString(startDate), endTime: getQueryDateString(startDate, 0, 'end'), queryName: charts[i].query_name, stationId, run: false }, setLoadingSearch);
        chartsToBuild.push(data);
      }
      catch (err) {
        console.error(err);
      }
    }
    setBuiltChats(chartsToBuild);
  };

  useEffect(() => {

  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock]);


  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOptions, stationId]);

  return (
    <PageWrapper>
      {({ width, height }) =>
        <Box display="flex" flexDirection="column" width={width} height={height} gap={1} key='dasbhoard-wrapper'>
          {/* TODO: Dashboard <br />
            * Anomalies Evolution (line)<br />
            * Anomalies Counting (bar)<br />
            * Parts Counting ok/nok (bar)<br />
            * Top 10 anomalies (table)<br />
            * Parts ok/nok evolution (line)<br />
            * */}
          <Box 
          width={width} 
          height={height} 
          sx={styleSx.dataBox}
          >
            {
              loadingSearch && builtChats.length === 0 ?
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