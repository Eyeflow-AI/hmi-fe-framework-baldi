// React
import React, { useMemo } from "react";

//Design
import Box from "@mui/material/Box";

//Internal
import FilterBox from "../Box/FilterBox";
import Carousel from "./Carousel";

//Third-party
import { colors } from "sdk-fe-eyeflow";

const styleSx = {
  mainBox: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    gap: 1,
  },
  defaultBox: { bgcolor: "white", borderRadius: 1 },
  createBatchButton: Object.assign({}, window.app_config.style.box, {
    bgcolor: "primary.main",
    display: "flex",
    flexDirection: "column",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  }),
  createSerialButton: Object.assign({}, window.app_config.style.box, {
    bgcolor: "primary.main",
    display: "flex",
    flexDirection: "column",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  }),
  createBatchButtonIcon: {
    height: 30,
    width: 30,
    filter: "invert(1)",
    marginBottom: "8px",
  },
  createSerialButtonIcon: {
    height: 30,
    width: 30,
    filter: "invert(1)",
    marginBottom: "8px",
  },
  noEventBox: {
    bgcolor: colors.eyeflow.yellow.dark,
    display: "flex",
    flexDirection: "column",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  menuBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }),
};

export default function CarouselWithQuery({
  height,
  width,
  config,
  queryFields,
  defaultIcon,
  onChangeParams,
  name,
  data,
  onClick,
  selectedItem,
  setComponentsInfo,
  loadingList,
}) {
  const { itemMenuHeight, buttonBoxHeight } = useMemo(() => {
    const itemMenuHeight = config?.itemHeight ?? 200;
    return {
      itemMenuHeight,
      buttonBoxHeight: itemMenuHeight + 10,
      hasMainButton: config?.hasMainButton ?? true,
      dateField: config?.dateField ?? "event_time",
    };
  }, [config]);

  const menuBoxHeight = height;

  // console.log({ name, selectedItem });

  return (
    <Box id="menu-box" height={menuBoxHeight} sx={styleSx.menuBox}>
      <FilterBox
        onChangeParams={onChangeParams}
        queryFields={queryFields}
        // keepRunningEvent={keepRunningEvent}
      />
      <Carousel
        height={height - buttonBoxHeight}
        width={width}
        defaultIcon={defaultIcon}
        name={name}
        data={data}
        loadingData={loadingList}
        itemMenuHeight={itemMenuHeight}
        onClick={onClick}
        selectedItem={selectedItem}
        setComponentsInfo={setComponentsInfo}
      />
    </Box>
  );
}
