import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";

import LayoutConstructor from "../../layoutConstructor";

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
  stationId,
}) {
  const [_style, _setStyle] = useState({});
  const [hide, setHide] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(null);

  useEffect(() => {
    if (style) {
      let __style = Object.assign({}, styleSx.mainBoxSx, style);
      _setStyle(__style);
    } else {
      _setStyle(styleSx.mainBoxSx);
    }
  }, [style]);

  useEffect(() => {
    if (
      componentsInfo &&
      typeof componentsInfo === "object" &&
      Object.keys(componentsInfo).length > 0
    ) {
      const component =
        componentsInfo?.find(
          (item) => item?.tag === "LayoutBox" && item?.name === name
        )?.output ?? {};

      setHide(component?.hide || false);
      setBackgroundColor(component.backgroundColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

  if (hide || !components || components.length === 0) {
    return null;
  } else {
    return (
      <Box
        sx={{
          ..._style,
          // border: 1,
          backgroundColor: backgroundColor || _style.backgroundColor,
          overflow: "hidden",
        }}
        key={name}
      >
        <LayoutConstructor
          config={{ components }}
          componentsInfo={componentsInfo}
          setComponentsInfo={setComponentsInfo}
          stationId={stationId}
        />
      </Box>
    );
  }
}
