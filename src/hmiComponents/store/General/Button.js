import React, { useState, useEffect } from "react";
import MUIButton from "@mui/material/Button";

import validateData from "../../functions/dataValidation/button";

export default function Button({ name, tag, componentsInfo, style, metadata }) {
  // console.log({ Title: name, tag, componentsInfo, style });

  const [value, setValue] = useState("");
  // const [error, setError] = useState(false);
  const [_style, _setStyle] = useState({});

  useEffect(() => {
    if (style) {
      _setStyle(style);
    } else {
      _setStyle({
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: 24,
        display: "flex",
        justifyContent: "center",
        height: "100%",
        fontWeight: "bold",
      });
    }
  }, [style]);

  useEffect(() => {
    if (componentsInfo && typeof componentsInfo === "object") {
      const component = validateData({
        obj:
          componentsInfo?.find(
            (item) => item?.tag === tag && item?.name === name
          )?.output ?? {},
      });
      // console.log({ component });
      setValue(component?.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

  return (
    <MUIButton
      sx={{
        ..._style,
      }}
      variant="contained"
    >
      {value ?? metadata?.text}
    </MUIButton>
  );
}
