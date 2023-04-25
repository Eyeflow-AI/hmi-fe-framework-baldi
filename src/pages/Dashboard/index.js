// React
import React, { useEffect, useState } from 'react';

// Design
import Box from '@mui/material/Box';
import { CircularProgress, Typography } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';

// Third-party
import { useTranslation } from "react-i18next";
import Bar from '../../components/Charts/Bar';

const charts = {
  bar: (chart) => <Bar chart={chart} />,
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

  const startDate = new Date();

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [builtChats, setBuiltChats] = useState([]);

  const getData = async () => {
    const charts = pageOptions?.options?.charts ?? [];
    const chartsToBuild = [];
    for (let i = 0; i < charts.length; i++) {
      // setLoadingSearch(true);
      try {
        let data = await API.get.queryData({ startTime: startDate, endTime: startDate, queryName: charts[i].query_name, stationId }, setLoadingSearch);
        console.log(data);

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
  }, [pageOptions, stationId]);

  return (
    <PageWrapper>
      {({ width, height }) =>
        <Box display="flex" flexDirection="column" width={width} height={height} gap={1}>
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