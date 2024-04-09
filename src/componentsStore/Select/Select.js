import React, { useEffect, useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MUISelect from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function Select({
  name,
  tag,
  style,
  metadata,
  componentsInfo,
  setComponentsInfo,
}) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);
  console.log({ componentsInfo, setComponentsInfo, metadata });

  const handleClick = (item) => {
    setValue(item.value);
    let _componentsInfo = [...componentsInfo];
    console.log({ click: item });
    let components = item?.data?.info?.components ?? [];
    for (let i = 0; i < components.length; i++) {
      let index = _componentsInfo.findIndex(
        (item) =>
          item.tag === components[i].tag && item.name === components[i].name
      );
      if (index !== -1) {
        _componentsInfo[index].output = {
          ...components[i].output,
        };
      } else {
        _componentsInfo.push({
          tag: components[i].tag,
          name: components[i].name,
          output: components[i].output,
        });
      }
    }
    setComponentsInfo(_componentsInfo);
  };

  useEffect(() => {
    if (componentsInfo && typeof componentsInfo === "object") {
      const component =
        componentsInfo.find((item) => item.tag === tag && item.name === name)
          ?.output ?? {};
      console.log({ component });
      setLabel(component?.label);
      const _list = component?.list ?? [];
      setList(_list);
    }
  }, [componentsInfo]);

  useEffect(() => {
    if (list && list.length > 0) {
      handleClick(list[0]);
    }
  }, [list]);

  return (
    <FormControl fullWidth>
      <InputLabel id="select-label">{metadata?.label}</InputLabel>
      <MUISelect labelId="select" id="select" value={value} label={label}>
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
