import React, { useEffect, useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MUISelect from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function Select({ name, tag, componentsInfo }) {
  console.log({ Select: name, tag, componentsInfo });

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    if (componentsInfo && typeof componentsInfo === "object") {
      const component =
        componentsInfo.find((item) => item.tag === tag && item.name === name)
          ?.output ?? {};
      console.log({ component });
      setLabel(component?.label);
      const _list = component?.list ?? [];
      setList(_list);
      setValue(_list[0]);
      // setTitle(component?.title);
      // setAdjacentText(component?.adjacentText);
      // setTimestamp(component?.timestamp);
      // setImageURL(component?.imageURL);
      // setColor(component?.color);
      // setImageCaption(component?.imageCaption);
      // setTooltip(component?.tooltip);
      // setOnImageLoading(true);

      // let status = component?.status ?? "";
      // let backgroundColor =
      //   component?.backgroundColor && component?.backgroundColor !== ""
      //     ? component?.backgroundColor
      //     : colors.statuses[status];
      // setBackgroundColor(backgroundColor);
    }
  }, [componentsInfo]);

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <MUISelect
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        // value={age}
        value={value}
        label={label}
        // onChange={handleChange}
      >
        {list.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  );
}
