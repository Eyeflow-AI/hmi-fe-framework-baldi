// React
import React from "react";

import Box from "@mui/material/Box";

import LayoutConstructor from "../../../componentsStore/layoutConstructor";

import GetWindowDimentions from "../../../utils/Hooks/GetWindowDimensions";

const mainBoxSx = Object.assign({}, window.app_config.style.box, {
  bgcolor: "background.paper",
  display: "flex",
  alignItems: "center",
  gap: 0.25,
  overflowX: "auto",
  overflowY: "hidden",
  width: "100%",
  height: "100%",
  whiteSpace: "pre-wrap", //TODO: Remove this line. Debug only
});

const styleSx = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, { opacity: 0.8 }),
};

export default function EventDataBox({
  config,
  componentsInfo,
  setComponentsInfo,
}) {
  console.log({ EventDataBox: componentsInfo });

  const { width, height } = GetWindowDimentions();
  return (
    <Box sx={styleSx.mainBox} height={height}>
      <LayoutConstructor
        config={config}
        componentsInfo={componentsInfo}
        setComponentsInfo={setComponentsInfo}
      />
    </Box>
  );
}
