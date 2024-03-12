// React
import React from "react";

import Box from "@mui/material/Box";

import DataBox from "./DataBox";
import GraphBox from "./GraphBox";
import MetalStampingBox from "./MetalStampingBox";
import CarrouselBox from "./CarrouselBox";

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

export default function EventBatchDataBox({
  data,
  config,
  disabled,
  examplesList,
}) {
  return (
    <Box
      width={config.width}
      height={config.height}
      sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}
    >
      {/* {data && (config.components.GraphBox?.active ?? true) && (
        <GraphBox data={data} config={config?.components?.GraphBox} />
      )}

      {data && (config.components.DataBox?.active ?? true) && (
        <DataBox data={data} config={config?.components?.DataBox} />
      )} */}

      <CarrouselBox data={data} config={config?.components?.DataBox} />

      {data && config.components.MetalStampingBox?.active && (
        <MetalStampingBox
          data={data}
          config={config?.components?.MetalStampingBox}
          examplesList={examplesList}
        />
      )}
    </Box>
  );
}
