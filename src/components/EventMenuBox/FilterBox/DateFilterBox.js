// React
import React, { useEffect, useState, useRef } from 'react';


//Design
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//Internal
import getQueryDateString from '../../../utils/functions/getQueryDateString';

//Third-party
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useTranslation } from "react-i18next";

const styleSx = {
  filterBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingLeft: 1,
    paddingRight: 1,
    paddingTop: 1,
  },
}

export default function DateFilterBox({
  onChangeParams,
  keepRunningEvent,
}) {

  const { t } = useTranslation();

  const [dateValue, setDateValue] = useState(new Date());
  const [manualChanging, setManualChanging] = useState(false);
  // keep running event as useRef
  const keepRunningEventRef = useRef(keepRunningEvent);

  useEffect(() => { //Update query params
    onChangeParams({ min_event_time: getQueryDateString(dateValue), max_event_time: getQueryDateString(dateValue, 1, 'end'), manualChanging });
    setManualChanging(false);
    // eslint-disable-next-line
  }, [dateValue]);

  const handleDateChange = (newValue) => {
    setManualChanging(true);
    setDateValue(newValue);
  };
  console.log({keepRunningEventRef})

  // get today date at every minute using useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      // if the day is different
      let today = (new Date());
      if (dateValue.getDate() !== today.getDate()) {
        // add 1 day to today
        if (keepRunningEventRef.current) {
          setDateValue(today);
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    keepRunningEventRef.current = keepRunningEvent;
  }, [keepRunningEvent]);


  return (
    <Box id="filter-box" sx={styleSx.filterBox} >
      <DesktopDatePicker
        label={t("date")}
        inputFormat="yyyy/MM/dd"
        value={dateValue}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </Box>
  );
};
