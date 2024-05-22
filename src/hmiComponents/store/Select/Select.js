import React, { useEffect, useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MUISelect from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import eventsHandler from "../../../utils/functions/eventsHandler";

import validateData from "../../functions/dataValidation/select";

export default function Select({
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
  // console.log({ componentsInfo, setComponentsInfo, metadata });

  const handleClick = (item) => {
    setValue(item.value);
    let _componentsInfo = [...componentsInfo];
    let index = _componentsInfo.findIndex(
      (item) => item.tag === tag && item.name === name
    );
    _componentsInfo[index].output.selectedValue = item.value;
    eventsHandler({
      componentsInfo: _componentsInfo,
      item,
      fnExecutor: setComponentsInfo,
      fnName: on?.click,
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
      // console.log({ component });

      const _list = component?.list ?? [];
      const _on = component?.on ?? {};
      const _value = component?.selectedValue ?? "";
      setList(_list);
      setOn(_on);
      setValue(_value);
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
      <InputLabel
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
      </MUISelect>
    </FormControl>
  );
}
