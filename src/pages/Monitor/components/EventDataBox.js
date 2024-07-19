// React
import React from "react";

import Box from "@mui/material/Box";

import LayoutConstructor from "../../../hmiComponents/layoutConstructor";

import GetWindowDimentions from "../../../utils/Hooks/GetWindowDimensions";

const mainBoxSx = Object.assign({}, window.app_config.style.box, {
  bgcolor: "background.paper",
  display: "flex",
  alignItems: "center",
  gap: 0.25,
  overflowX: "auto",
  overflowY: "hidden",
  width: "100%",
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
  stationId,
}) {
  // eslint-disable-next-line no-unused-vars
  const { width, height } = GetWindowDimentions();
  return (
    <Box sx={styleSx.mainBox} height="100%">
      <LayoutConstructor
        config={config}
        componentsInfo={componentsInfo}
        setComponentsInfo={setComponentsInfo}
        stationId={stationId}
      />
    </Box>
  );
}
