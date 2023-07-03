// React
import React, { useEffect, useState } from 'react';


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
}) {

  const { t } = useTranslation();

  const [dateValue, setDateValue] = useState(new Date());

  useEffect(() => { //Update query params
    onChangeParams({ min_event_time: getQueryDateString(dateValue), max_event_time: getQueryDateString(dateValue, 1, 'end') });
    // eslint-disable-next-line
  }, [dateValue]);

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
  };

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
