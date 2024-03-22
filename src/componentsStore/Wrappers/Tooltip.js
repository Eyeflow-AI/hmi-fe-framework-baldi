// React
import React from "react";

// Design
import MUITooltip from "@mui/material/Tooltip";

export default function Tooltip({ tooltip, children }) {
  if (tooltip?.show && tooltip?.title) {
    return <MUITooltip title={tooltip?.title}>{children}</MUITooltip>;
  } else {
    return children;
  }
}
