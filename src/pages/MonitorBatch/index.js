import React, {useEffect, useState} from 'react'


import Box from '@mui/material/Box';


import AppBar from '../../components/AppBar';
import EventHeader from '../../components/EventHeader';
import EventMenuBox from '../../components/EventMenuBox';
import GetBatchList from '../../utils/Hooks/GetBatchList';
import API from '../../api';


const PAGE_CONFIG = window.app_config.pages.Monitor;
const APPBAR_HEIGHT = window.app_config.components.AppBar.height;
const EVENT_MENU_WIDTH = PAGE_CONFIG.options.eventMenuWidth ?? 200;

const styleSx = {
  mainBox: {
    display: 'flex',
    width: 'calc(100vw)',
    height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
    padding: 1,
    overflow: 'hidden',
  },
  eventMenuBox: Object.assign({}, window.app_config.style.box, {
    width: EVENT_MENU_WIDTH,
    bgcolor: 'white',
  }),
  dataBox: {
    display: 'flex',
    flexGrow: 1,
    marginLeft: 1
  },
};


export default function Monitor() {

  const [queryParams, setQueryParams] = useState(null);
  const {batchList} = GetBatchList({queryParams, sleepTime: window.app_config.pages?.Monitor?.options?.getEventSleepTime ?? 30000});
  const [selectedBatch, setSelectedBatch] = useState(null);

  const onChangeEvent = (batchId) => {
    API.getBatch({batchId})
      .then((data) => {
        setSelectedBatch(data.batch);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (selectedBatch && batchList.findIndex((el) => el._id === selectedBatch._id) === -1) {
      setSelectedBatch(null);
    };
  // eslint-disable-next-line
  }, [batchList]);

  return (
    <>
      <AppBar />
      <Box id="monitor-main-box" sx={styleSx.mainBox}>
        <Box id="monitor-event-menu-box" sx={styleSx.eventMenuBox}>
          <EventMenuBox
            events={batchList}
            selectedEvent={selectedBatch}
            onChangeEvent={onChangeEvent}
            queryParams={queryParams}
            onChangeParams={setQueryParams}
            config={PAGE_CONFIG.components.EventMenuBox}
          />
        </Box>
        <Box id="monitor-data-box" sx={styleSx.dataBox}>
          <EventHeader
            data={selectedBatch}
            disabled={!selectedBatch}
            config={PAGE_CONFIG.components.EventHeader}
          />
        </Box>
      </Box>
    </>
  );
}
