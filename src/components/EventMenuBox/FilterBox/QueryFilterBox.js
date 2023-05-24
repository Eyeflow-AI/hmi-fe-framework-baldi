// React
import React, { useEffect, useState } from 'react';


//Design
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

//Internal
import getQueryDateString from '../../../utils/functions/getQueryDateString';

//Third-party
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useTranslation } from "react-i18next";

const styleSx = {
  filterBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 1,
    paddingRight: 1,
    paddingTop: 1,
    gap: 1,
  },
}

const components = {
  "date": ({label, value, onChange}) => (
    <DesktopDatePicker
      label={label}
      inputFormat="yyyy/MM/dd"
      value={value}
      onChange={onChange}
      renderInput={(params) => <TextField {...params} />}
    />
  )
}
export default function DateFilterBox({
  queryFields,
  onChangeParams,
}) {

  const { t } = useTranslation();

  const [inputList, setInputList] = useState([]);

  useEffect(() => {
    setInputList(queryFields.map((queryField) => {
      return {
        type: queryField.type,
        label: queryField.label,
        value: queryField.type === "date" ? new Date() : "",
      }
    }))
  }, [queryFields]);

  // useEffect(() => { //Update query params
  //   onChangeParams({ min_event_time: getQueryDateString(dateValue), max_event_time: getQueryDateString(dateValue, { dayTimeDelta: 1 }) });
  //   // eslint-disable-next-line
  // }, [dateValue]);

  const handleChange = (index) => (newValue) => {
    setInputList((prevInputList) => {
      const newInputList = [...prevInputList];
      newInputList[index].value = newValue;
      return newInputList;
    });
  };

  const handleSearch = () => {

  };

  return (
    <Box id="filter-box" sx={styleSx.filterBox} >
      {inputList.map((inputData, index) => (
        <Box key={index}>
          {components[inputData.type]({label: t(inputData.label), value: inputData.value, onChange: handleChange(index)})}
        </Box>
      ))}
      <Button fullWidth variant="contained" aria-label="search" onClick={handleSearch}>
        <SearchIcon />
      </Button>
    </Box>
  );
};
