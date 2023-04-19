// React
import React, { useEffect, useState, Fragment } from 'react';


//Design
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';

//Internal
import getQueryDateString from '../../utils/functions/getQueryDateString';
import EventMenuItem from './EventMenuItem';

//Third-party
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useTranslation } from "react-i18next";


const styleSx = {
  mainBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: 1
  },
  defaultBox: { bgcolor: "white", borderRadius: 1 },
  createBatchButton: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'primary.main',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  createBatchButtonIcon: {
    height: 30,
    width: 30,
    filter: 'invert(1)',
    marginBottom: '8px'
  },
  menuBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  }
  ),
  filterBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingLeft: 1,
    paddingRight: 1,
    paddingTop: 1,
  },
  listBox: {
    height: '100%',
    boxShadow: 'inset 0 2px 4px #00000040',
    margin: 1,
    alignItems: 'center',
    borderRadius: window.app_config.style.box.borderRadius,
    bgcolor: 'background.paperLighter',
  },
}

export default function EventMenuList({
  type,
  onClickCreateBatch,
  height,
  width,
  runningEvent,
  events,
  selectedEvent,
  queryParams,
  loadingData,
  onChangeParams,
  onChangeEvent,
  config
}) {


  const { t } = useTranslation();

  const eventsLength = events?.length ?? 0;
  const itemMenuHeight = config?.itemHeight ?? 200;
  const batchButtonBoxHeight = type === "batch" ? itemMenuHeight + 10 : 0;
  const menuBoxHeight = height - batchButtonBoxHeight;
  const dateField = config?.dateField ?? "event_time";
  const startBatchIcon = config?.startBatchIcon;

  const [dateValue, setDateValue] = useState(new Date());

  useEffect(() => { //Update query params
    onChangeParams({ min_event_time: getQueryDateString(dateValue), max_event_time: getQueryDateString(dateValue, { dayTimeDelta: 1 }) });
    // eslint-disable-next-line
  }, [dateValue]);

  const onEventClick = (eventData) => () => onChangeEvent(eventData._id);

  function ItemRenderer({ index, style }) {

    let eventData = events[index];
    let eventIndex = eventData?.index ?? 0;
    let selected = selectedEvent?._id === eventData._id;

    const customStyle = Object.assign(
      { display: 'flex', justifyContent: 'center', paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2 },
      style
    );

    return (
      <div key={`item-${index}`} style={customStyle}>
        <EventMenuItem
          index={eventIndex}
          dateField={dateField}
          eventData={eventData}
          selected={selected}
          onClick={onEventClick(eventData)}
        />
      </div>
    )
  };

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
  };


  return (
    <Box id="event-menu-box" width={width} sx={styleSx.mainBox}>
      {type === "batch" && (
        <Box height={batchButtonBoxHeight} sx={styleSx.defaultBox}>
          {runningEvent
            ? (
              <EventMenuItem
                index={null}
                dateField={dateField}
                eventData={runningEvent}
                selected={runningEvent._id === selectedEvent?._id}
                onClick={onEventClick(runningEvent)}
              />
            )
            : (
              <ButtonBase>
                <Box height={batchButtonBoxHeight} width={width} onClick={onClickCreateBatch} sx={styleSx.createBatchButton}>
                  <img alt="" src={startBatchIcon} style={styleSx.createBatchButtonIcon} />
                  {t("new_batch")}
                </Box>
              </ButtonBase>
            )
          }
          {type === "serial" && runningEvent &&
            <Box height={batchButtonBoxHeight} sx={styleSx.defaultBox}>
              <EventMenuItem
                index={null}
                dateField={dateField}
                eventData={runningEvent}
                selected={runningEvent._id === selectedEvent?._id}
                onClick={onEventClick(runningEvent)}
              />
            </Box>
          }
        </Box>
      )}
      <Box id="menu-box" height={menuBoxHeight} sx={styleSx.menuBox} >
        <Box id="filter-box" sx={styleSx.filterBox} >
          <DesktopDatePicker
            label={t("date")}
            inputFormat="yyyy/MM/dd"
            value={dateValue}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>

        <Box id="list-box" sx={styleSx.listBox}>
          {(eventsLength === 0 && loadingData)
            ? (
              <Box height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                {`${t('loading')}...`}
                <CircularProgress />
              </Box>
            )
            : (
              <Fragment>
                {eventsLength === 0
                  ? (
                    <Box height="100%" display="flex" justifyContent="center" alignItems="center">
                      {t("no_data")}
                    </Box>
                  )
                  : (
                    <AutoSizer>
                      {({ height, width }) => (
                        <List
                          height={height}
                          width={width}
                          itemSize={itemMenuHeight}
                          itemCount={eventsLength}
                        >
                          {ItemRenderer}
                        </List>
                      )}
                    </AutoSizer>
                  )
                }
              </Fragment>
            )
          }
        </Box>
      </Box>
    </Box>
  );
};
