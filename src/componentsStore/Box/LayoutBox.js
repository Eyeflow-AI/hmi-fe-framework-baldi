import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";

import LayoutConstructor from "../layoutConstructor";

const styleSx = {
  mainBoxSx: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    // height: "100%",
    flexGrow: 1,
    // flexWrap: "no-wrap",
  },
};

export default function LayoutBox({
  name,
  style,
  components,
  componentsInfo,
  setComponentsInfo,
  metadata,
}) {
  const [_style, _setStyle] = useState({});

  useEffect(() => {
    if (style) {
      let __style = Object.assign({}, styleSx.mainBoxSx, style);
      _setStyle(__style);
    } else {
      _setStyle(styleSx.mainBoxSx);
    }
  }, [style]);

  return (
    <Box
      sx={{
        ..._style,
        // border: 1,
        overflow: "hidden",
      }}
      key={name}
    >
      <LayoutConstructor
        config={{ components }}
        componentsInfo={componentsInfo}
        setComponentsInfo={setComponentsInfo}
      />
    </Box>
  );
}
