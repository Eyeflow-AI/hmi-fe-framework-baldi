// React
import React, { useMemo } from "react";

// Design
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// Internal
import { IconButton } from "../../../componentsStore/Button";

// Third-party

const mainBoxSx = Object.assign({}, window.app_config.style.box, {
  bgcolor: "background.paper",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: 1,
  // paddingTop: 2,
  marginRight: 1,
  // marginBottom: 1,
  // width: "100%",
});

const style = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, { opacity: 0.8 }),
  buttonImage: {
    height: 30,
    width: 30,
    filter: "invert(1)",
  },
  buttonBox: {
    position: "relative",
    // border: "1px solid #ccc",
  },
  circularProgress: {
    position: "absolute",
    top: "8px",
    left: "8px",
    zIndex: 1,
  },
};

export default function EventAppBar({ config, stationId, componentsInfo }) {
  // console.log({ EventAppBar: componentsInfo, config });

  const { buttonList, hasAppBar } = useMemo(() => {
    let buttonList = [];
    let hasAppBar = false;
    let buttonListName = "";
    // console.log({ componentsInfo });
    if (componentsInfo && Array.isArray(componentsInfo)) {
      let output =
        componentsInfo?.find((item) => item?.name === config?.name)?.output ??
        null;
      // console.log({ output });
      if (output?.status) {
        hasAppBar = true;
        if (output?.status === "running") {
          buttonListName = "runningItemButtonList";
        } else if (output?.status === "paused") {
          buttonListName = "pausedItemButtonList";
        } else if (output?.status === "stopped") {
          buttonListName = "itemButtonList";
        }

        for (let buttonData of config?.[buttonListName] ?? []) {
          // console.log({ buttonData });
          let button = {
            icon: buttonData.icon,
            tooltip: buttonData.tooltip,
            component: buttonData.component,
            stationId,
            fnName: "postData",
          };
          buttonList.push(button);
        }
      }
    }
    return {
      buttonList,
      hasAppBar,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo, config]);
  // console.log({ hasAppBar });

  if (hasAppBar) {
    return (
      <Box
        width={`${buttonList.length * 70}px`}
        sx={
          buttonList.length > 0
            ? true
              ? style.mainBoxDisabled
              : style.mainBox
            : { display: "none" }
        }
      >
        {buttonList.map((buttonProps, index) => (
          <Box sx={style.buttonBox} key={`${index}-button-app-bar`}>
            <IconButton
              key={index}
              tooltip={buttonProps.tooltip}
              icon={buttonProps.icon}
              component={buttonProps.component}
              stationId={buttonProps.stationId}
              componentsInfo={componentsInfo}
              fnName={buttonProps.fnName}
            />
          </Box>
        ))}
      </Box>
    );
  } else {
    return null;
  }
}
