// React
import React from "react";

import Box from "@mui/material/Box";

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

export default function EventDataBox({ config }) {
  return <Box sx={styleSx.mainBox}>data box</Box>;
}
