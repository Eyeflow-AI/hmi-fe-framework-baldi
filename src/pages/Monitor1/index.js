import React, {useState} from 'react'


import Box from '@mui/material/Box';


import AppBar from '../../components/AppBar';
import EventHeader from '../../components/EventHeader';
import EventMenuBox from '../../components/EventMenuBox';
import GetEvents from '../../utils/Hooks/GetEvents';


const PAGE_CONFIG = window.app_config.pages.Monitor;
const APPBAR_HEIGHT = window.app_config.components.AppBar.height;


const styleSx = {
  mainBox: {
    display: 'flex',
    width: 'calc(100vw)',
    height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
    padding: 1,
    overflow: 'hidden',
  },
  eventMenuBox: Object.assign({}, window.app_config.style.box, {
    width: PAGE_CONFIG.options.eventMenuWidth ?? 200,
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
  const {events} = GetEvents({queryParams, sleepTime: 30000});
  const [selectedEvent, setSelectedEvent] = useState(null);

  const onChangeEvent = (inspectionId) => {
    setSelectedEvent({_id: inspectionId});
  };

  return (
    <>
      <AppBar />
      <Box id="monitor-main-box" sx={styleSx.mainBox}>
        <Box id="monitor-event-menu-box" sx={styleSx.eventMenuBox}>
          <EventMenuBox
            events={events}
            selectedEvent={selectedEvent}
            onChangeEvent={onChangeEvent}
            queryParams={queryParams}
            onChangeParams={setQueryParams}
            config={PAGE_CONFIG.components.EventMenuBox}
          />
        </Box>
        <Box id="monitor-data-box" sx={styleSx.dataBox}>
          <EventHeader
            data={selectedEvent}
            config={PAGE_CONFIG.components.EventHeader}
          />
        </Box>
      </Box>
    </>
  );
}
