import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

export default function Title({ name, tag, componentsInfo, style }) {
  console.log({ Title: name, tag, componentsInfo, style });

  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [_style, _setStyle] = useState({});

  useEffect(() => {
    if (style) {
      _setStyle(style);
    } else {
      _setStyle({
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: 24,
        fontWeight: "bold",
      });
    }
  }, [style]);

  useEffect(() => {
    if (componentsInfo && typeof componentsInfo === "object") {
      const component =
        componentsInfo?.find((item) => item?.tag === tag && item?.name === name)
          ?.output ?? {};
      // console.log({ component });
      setValue(component?.text);
    }
  }, [componentsInfo]);

  return (
    <Typography
      sx={{
        ..._style,
      }}
    >
      {value}
    </Typography>
  );
}
