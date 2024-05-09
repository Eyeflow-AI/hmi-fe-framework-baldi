import React, { useState, useEffect } from "react";
import MUITextField from "@mui/material/TextField";

import eventsHandler from "../../utils/functions/eventsHandler";
export default function TextField({
  name,
  tag,
  componentsInfo,
  setComponentsInfo,
  metadata,
  stationId,
}) {
  // console.log({ TextField: name, tag, componentsInfo });

  const [item, setItem] = useState(null);
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const error = false;

  useEffect(() => {
    if (componentsInfo && typeof componentsInfo === "object") {
      const component =
        componentsInfo?.find((item) => item?.tag === tag && item?.name === name)
          ?.output ?? {};
      // console.log({ component });
      setValue(component?.text);
      setDisabled(component?.disabled);
      setItem(component);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

  const handleChange = (event) => {
    let _componentsInfo = [...componentsInfo];
    let index = _componentsInfo.findIndex(
      (item) => item.tag === tag && item.name === name
    );

    if (index !== -1) {
      let newValue = event.target.value;
      setValue(newValue);
      // console.log({ name, newValue });
      _componentsInfo[index].output.text = newValue;
      // console.log({ dialogStart: _componentsInfo });
      eventsHandler({
        componentsInfo: _componentsInfo,
        item,
        fnExecutor: setComponentsInfo,
        fnName: item?.on?.change,
        stationId,
      });
    }
  };

  useEffect(
    () => {
      if (item) {
        if (!item?.disabled && item?.on?.change) {
          setDisabled(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item]
  );

  // console.log({ componentsInfo });
  return (
    <MUITextField
      value={value}
      onChange={handleChange}
      helperText={error ? "Please enter a valid value" : ""}
      label={metadata?.label ?? ""}
      disabled={disabled}
      sx={{
        "& label.Mui-focused": {
          color: "#E0E3E7",
        },
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: "#E0E3E7",
          },
        },
      }}
    />
  );
}
