import React, { useEffect, useState } from "react";

import FormControl from "@mui/material/FormControl";
import MUIAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import eventsHandler from "../../../utils/functions/eventsHandler";

import validateData from "../../functions/dataValidation/autocomplete";

export default function Autocomplete({
  name,
  tag,
  style,
  metadata,
  componentsInfo,
  setComponentsInfo,
  stationId,
}) {
  // const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  const [on, setOn] = useState({});
  const [emptyObject, setEmptyObject] = useState({});
  // console.log({ componentsInfo, setComponentsInfo, metadata, emptyObject });

  const handleChange = (item) => {
    // console.log({
    //   _item: item,
    //   componentsInfo,
    //   setComponentsInfo,
    //   metadata,
    //   emptyObject,
    //   on,
    // });
    let _item = { ...item };
    if (!item?.value) {
      _item = { ...emptyObject };
    }
    setValue(_item.value);
    let _componentsInfo = [...componentsInfo];
    let index = _componentsInfo.findIndex(
      (item) => item.tag === tag && item.name === name
    );
    _componentsInfo[index].output.selectedValue = _item.value;
    eventsHandler({
      componentsInfo: _componentsInfo,
      item: _item,
      fnExecutor: setComponentsInfo,
      fnName: on?.change,
      stationId,
    });
  };

  useEffect(() => {
    if (
      componentsInfo &&
      typeof componentsInfo === "object" &&
      Object.keys(componentsInfo).length > 0
    ) {
      const component = validateData({
        obj:
          componentsInfo.find((item) => item.tag === tag && item.name === name)
            ?.output ?? {},
      });
      console.log({ autocomplete: component });

      const _list = component?.list ?? [];
      const _on = component?.on ?? {};
      const _value = component?.selectedValue ?? "";
      const _emptyObject = component?.emptyObj ?? {};
      setList(_list);
      setOn(_on);
      setValue(_value);
      setEmptyObject(_emptyObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

  // useEffect(() => {
  //   if (list && list.length > 0) {
  //     handleClick(list[0]);
  //   }
  // }, [list]);

  return (
    <FormControl
      fullWidth
      sx={{
        //marginTop: "12px",
        "& label.Mui-focused": {
          color: "#E0E3E7",
        },
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: "#E0E3E7",
          },
        },
      }}
    >
      {/* <InputLabel
        id="select-label"
        sx={
          {
            // paddingTop: `12px`,
          }
        }
      >
        {metadata?.label}
      </InputLabel>
      <MUISelect
        labelId="select"
        id="select"
        value={value}
        label={metadata?.label}
      >
        {list.map((item, index) => (
          <MenuItem
            key={index}
            value={item.value}
            onClick={() => handleClick(item)}
          >
            {item.text}
          </MenuItem>
        ))}

      </MUISelect> */}
      <MUIAutocomplete
        disablePortal
        id="combo-box-demo"
        // options={top100Films}
        options={list}
        // sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label={metadata?.label} helperText={metadata?.helperText} />
        )}
        value={value}
        onChange={(event, newValue) => {
          handleChange(newValue);
        }}
      />
    </FormControl>
  );
}
