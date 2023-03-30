import React, { useEffect, useState } from 'react'


//Design
import Box from '@mui/material/Box';


//Internal
import PageWrapper from '../../components/PageWrapper';
import EventHeader from '../../components/EventHeader';
import EventMenuBox from '../../components/EventMenuBox';
import EventBatchDataBox from '../../components/EventBatchDataBox';
import GetBatchList from '../../utils/Hooks/GetBatchList';
import GetRunningBatch from '../../utils/Hooks/GetRunningBatch';

import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import API from '../../api';


const style = {
  mainBox: {
    display: 'flex',
    overflow: 'hidden',
  },
  dataBox: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: 1,
    gap: 1,
  },
};


export default function Monitor({pageOptions}) {

  const { _id: stationId } = GetSelectedStation();
  const [queryParams, setQueryParams] = useState(null);

  const { batchList, loading: loadingBatchList } = GetBatchList({ stationId, queryParams, sleepTime: pageOptions.options.getEventSleepTime });
  const {runningBatch} = GetRunningBatch({stationId, sleepTime: pageOptions.options.getEventSleepTime});

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedBatchCountData, setSelectedBatchCountData] = useState(null);

  const onChangeEvent = (batchId) => {
    API.get.batch({ stationId, batchId })
      .then((data) => {
        setSelectedBatch(data.batch);
        setSelectedBatchCountData(data.countData);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!selectedBatch && runningBatch) {
      onChangeEvent(runningBatch._id);
    };
    // eslint-disable-next-line
  }, [selectedBatch, runningBatch]);

  // useEffect(() => {console.log({runningBatch})}, [runningBatch]);
  useEffect(() => {
    if (selectedBatch && (selectedBatch._id !== runningBatch?._id) && batchList.findIndex((el) => el._id === selectedBatch._id) === -1) {
      setSelectedBatch(null);
      setSelectedBatchCountData(null);
    };
    // eslint-disable-next-line
  }, [batchList]);

  useEffect(() => {
    if (queryParams && queryParams.station !== stationId) {
      setQueryParams((params) => Object.assign({}, params, { station: stationId }));
    };
  }, [stationId, queryParams]);

  const onChangeParams = (newValue) => {
    setQueryParams((params) => {
      let newParams = Boolean(params) ? { ...params } : {};
      Object.assign(newParams, newValue);
      if (!newParams.hasOwnProperty("station")) {
        newParams["station"] = stationId;
      };
      return newParams;
    });
  };

  const onClickCreateBatch = () => {
    console.log("onClickCreateBatch");
  };

  return (
    <PageWrapper>
      {({width, height}) => 
        <Box width={width} height={height} sx={style.mainBox}>
          {/* <Box id="monitor-event-menu-box" width={pageOptions.options.eventMenuWidth}> */}
            <EventMenuBox
              type="batch"
              width={pageOptions.options.eventMenuWidth}
              onClickCreateBatch={onClickCreateBatch}
              runningEvent={runningBatch}
              events={batchList}
              loadingData={loadingBatchList}
              selectedEvent={selectedBatch}
              onChangeEvent={onChangeEvent}
              queryParams={queryParams}
              onChangeParams={onChangeParams}
              config={pageOptions.components.EventMenuBox}
              height={height}
            />
          {/* </Box> */}
          <Box id="monitor-data-box" sx={style.dataBox}>
            <EventHeader
              data={selectedBatch}
              disabled={!selectedBatch}
              config={pageOptions.components.EventHeader}
            />
            <EventBatchDataBox
              data={selectedBatch}
              countData={selectedBatchCountData}
              disabled={!selectedBatch}
              config={pageOptions.components.EventBatchDataBox}
            />
          </Box>
        </Box>
    }
    </PageWrapper>
  );
}
