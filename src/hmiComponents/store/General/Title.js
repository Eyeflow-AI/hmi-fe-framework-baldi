import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

import validateData from "../../functions/dataValidation/title";

export default function Title({ name, tag, componentsInfo, style, metadata }) {
  // console.log({ Title: name, tag, componentsInfo, style });

  const [value, setValue] = useState("");
  // const [error, setError] = useState(false);
  const [_style, _setStyle] = useState({
      textAlign: "center",
      textTransform: "uppercase",
      fontSize: 24,
      display: "flex",
      justifyContent:"center",
      height:"100%",
      fontWeight: "bold",
  });
  const [backgroundColor, setBackgroundColor] = useState("transparent");

  useEffect(() => {
    if (style) {
      let s = Object.assign(_style, style)
      _setStyle(s)
    }
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
      setBackgroundColor(component?.backgroundColor ?? "transparent");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

  return (
    <Typography
      sx={{
        ..._style,
        backgroundColor,
      }}
    >
      {value ?? metadata?.text}
    </Typography>
  );
}
