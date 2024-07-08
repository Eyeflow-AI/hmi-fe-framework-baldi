import React, { useState, useEffect } from "react";
import MUIButton from "@mui/material/Button";

import validateData from "../../functions/dataValidation/button";
import eventsHandler from "../../../utils/functions/eventsHandler";
import { setNotificationBar } from "../../../store/slices/app";

import { useDispatch } from "react-redux";

export default function Button({ name, tag, componentsInfo, style, metadata, stationId }) {
  // console.log({ Title: name, tag, componentsInfo, style })

  const [value, setValue] = useState("");
  // const [error, setError] = useState(false);
  const [_style, _setStyle] = useState({
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 24,
    display: "flex",
    justifyContent: "center",
    height: "100%",
    fontWeight: "bold",
  });
  const [item, setItem] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (style) {
      let s = Object.assign(_style, style)
      _setStyle(s)
    }
    // eslint-disable-next-line
  }, [style]);

  useEffect(() => {
    if (
      componentsInfo &&
      typeof componentsInfo === "object" &&
      Object.keys(componentsInfo).length > 0
    ) {
      const component = validateData({
        obj:
          componentsInfo?.find(
            (item) => item?.tag === tag && item?.name === name
          )?.output ?? {},
      });
      // console.log({ component });
      setValue(component?.text);
      setItem(component);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

  const handleNotificationBar = (message, severity) => {
    dispatch(
      setNotificationBar({
        show: true,
        type: severity,
        message: message,
      })
    );
  };

  const handleClick = () => {
    let _componentsInfo = [...componentsInfo];

    eventsHandler({
      componentsInfo: _componentsInfo,
      item: item?.on?.click,
      fnExecutor: item?.fnExecutor,
      fnName: item?.fnName,
      stationId,
      handleNotificationBar
    });
  };


  return (
    <MUIButton
      sx={{
        ..._style,
      }}
      variant="contained"
      onClick={() => handleClick()}
    >
      {value ?? metadata?.text}
    </MUIButton>
  );
}
