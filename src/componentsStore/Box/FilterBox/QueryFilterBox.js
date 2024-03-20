// React
import React, { useEffect, useState } from "react";

//Design
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

//Internal
import getQueryDateString from "../../../utils/functions/getQueryDateString";

//Third-party
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useTranslation } from "react-i18next";
import { DesktopDateTimePicker } from "@mui/x-date-pickers";

const styleSx = {
  filterBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 1,
    paddingRight: 1,
    paddingTop: 1,
    gap: 1,
  },
};

const components = {
  date: ({ label, value, onChange }) => (
    <DesktopDatePicker
      label={label}
      inputFormat="dd/MM/yyyy"
      value={value}
      onChange={onChange}
      renderInput={(params) => <TextField {...params} />}
    />
  ),
  text: ({ label, value, onChange }) => (
    <TextField label={label} value={value} onChange={onChange} />
  ),
  hour_minute: ({ label, value, onChange }) => (
    <DesktopDateTimePicker
      label={label}
      inputFormat="dd/MM/yy HH:mm:ss"
      value={value}
      onChange={onChange}
      renderInput={(params) => <TextField {...params} />}
    />
  ),
};
export default function DateFilterBox({ queryFields, onChangeParams }) {
  const { t } = useTranslation();

  const [inputList, setInputList] = useState([]);

  useEffect(() => {
    setInputList(
      queryFields.map((queryField) => {
        let defaultValue;
        if (["date", "hour_minute"].includes(queryField.type)) {
          if (queryField.field === "min_event_time") {
            defaultValue = new Date(getQueryDateString(new Date()));
          } else if (queryField.field === "max_event_time") {
            defaultValue = new Date(getQueryDateString(new Date(), 1, "end"));
          } else {
            defaultValue = new Date();
          }
        } else if (queryField.type === "text") {
          defaultValue = queryField?.defaultValue ?? "";
        }

        return {
          type: queryField.type,
          label: queryField.locale,
          field: queryField.field,
          value: defaultValue,
        };
      })
    );
  }, [queryFields]);

  const handleChange = (index, type) => (newValue) => {
    if (type === "text") {
      newValue = newValue.target.value;
    }

    setInputList((prevInputList) => {
      const newInputList = [...prevInputList];
      newInputList[index].value = newValue;
      return newInputList;
    });
  };

  const handleSearch = () => {
    let newValue = {};
    let deleteKeys = [];
    inputList.forEach((inputData) => {
      if (inputData.value === "") {
        deleteKeys.push(inputData.field);
      } else {
        newValue[inputData.field] = inputData.value;
      }
    });
    onChangeParams(newValue, deleteKeys);
  };

  return (
    <Box id="filter-box" sx={styleSx.filterBox}>
      {inputList.map((inputData, index) => (
        <Box key={index}>
          {components[inputData.type]({
            label: t(inputData.label),
            value: inputData.value,
            onChange: handleChange(index, inputData.type),
          })}
        </Box>
      ))}
      <Button
        fullWidth
        variant="contained"
        aria-label="search"
        onClick={handleSearch}
      >
        <SearchIcon />
      </Button>
    </Box>
  );
}
