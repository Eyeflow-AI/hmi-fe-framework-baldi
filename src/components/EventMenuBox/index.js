// React
import React, {useEffect, useState, Fragment} from 'react';


//Design
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

//Internal
import getQueryDateString from '../../utils/functions/getQueryDateString';
import EventMenuItem from './EventMenuItem';

//Third-party
import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useTranslation } from "react-i18next";


const styleSx = {
  mainBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
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
    // bgcolor: colors.eyeflow.blue.medium
    bgcolor: '#DBDBDB'
  },
}

export default function EventMenuList({
  type,
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
  const [dateValue, setDateValue] = useState(new Date());

  useEffect(() => { //Update query params
    onChangeParams({min_event_time: getQueryDateString(dateValue), max_event_time: getQueryDateString(dateValue, {dayTimeDelta: 1})});
  // eslint-disable-next-line
  }, [dateValue]);

  function ItemRenderer({ index, style }) {

    let dateField = config?.dateField ?? "event_time";

    let eventData = events[index];
    let selected = selectedEvent?._id === eventData._id;

    const customStyle = Object.assign(
      {display: 'flex', justifyContent: 'center', padding: 4},
      style
    );

    const onItemClick = () => onChangeEvent(eventData._id);

    return (
      <div key={`item-${index}`} style={customStyle}>
        <EventMenuItem
          dateField={dateField}
          eventData={eventData}
          selected={selected}
          onClick={onItemClick}
        />
      </div>
    )
  };

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
  };

  return (
    <Box id="event-menu-box" sx={styleSx.mainBox}>
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
                itemSize={config?.itemHeight ?? 200}
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
  );
};
