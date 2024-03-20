// React
import React, { useEffect, useState, useMemo } from "react";

//Design
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";

//Internal
import FilterBox from "../../../../componentsStore/Box/FilterBox";
import EventMenuItem from "./EventMenuItem";
import EventMenuList from "./EventMenuList";
import fetchJson from "../../../../utils/functions/fetchJson";
import { monitorSlice } from "../../../../store/slices/monitor";

//Third-party
import { useTranslation } from "react-i18next";
import { colors } from "sdk-fe-eyeflow";
import { useDispatch, useSelector } from "react-redux";
import CarouselWithDate from "../../../../componentsStore/Caroussel/CarouselWithDate";

const styleSx = {
  mainBox: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    gap: 1,
  },
  defaultBox: { bgcolor: "white", borderRadius: 1 },
  startButton: Object.assign({}, window.app_config.style.box, {
    bgcolor: "primary.main",
    display: "flex",
    flexDirection: "column",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  }),
  startButtonIcon: {
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

export default function EventMenuBox({ height, width, config }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.monitor);
  const { t } = useTranslation();

  const {
    itemMenuHeight,
    buttonBoxHeight,
    hasMainButton,
    queryFields,
    dateField,
  } = useMemo(() => {
    const itemMenuHeight = config?.itemHeight ?? 200;
    return {
      itemMenuHeight,
      buttonBoxHeight: itemMenuHeight + 10,
      hasMainButton: config?.hasMainButton ?? true,
      queryFields: config?.queryFields ?? [],
      dateField: config?.dateField ?? "event_time",
    };
  }, [config]);

  const startIcon = config?.startIcon;
  const noEventIcon = config?.noEventIcon;
  const conveyorIcon = config?.conveyorIcon;

  const [menuBoxHeight, setMenuBoxHeight] = useState(height);

  useEffect(() => {
    if (hasMainButton) {
      setMenuBoxHeight(height - buttonBoxHeight);
    } else {
      setMenuBoxHeight(height);
    }
  }, [height, hasMainButton, buttonBoxHeight]);

  return (
    <Box id="event-menu-box" width={width} sx={styleSx.mainBox}>
      {hasMainButton && (
        <Box height={buttonBoxHeight} sx={styleSx.defaultBox}>
          {state?.runningEvent ? (
            <EventMenuItem
              index={null}
              dateField={dateField}
              eventData={state?.runningEvent}
              selected={state?.runningEvent._id === state?.id}
              // onClick={() => onChangeEventByClick(state?.runningEvent._id)}
              // conveyorIcon={runningMaskIcon ?? conveyorIcon}
              conveyorIcon={conveyorIcon}
            />
          ) : (
            <ButtonBase>
              <Box
                height={buttonBoxHeight}
                width={width}
                // onClick={onClickCreateBatch}
                sx={styleSx.startButton}
              >
                <img alt="" src={startIcon} style={styleSx.startButtonIcon} />
                {t("start")}
              </Box>
            </ButtonBase>
          )}
        </Box>
      )}

      <Box id="menu-box" height={menuBoxHeight} sx={styleSx.menuBox}>
        <CarouselWithDate
          height={menuBoxHeight}
          width={width}
          config={config}
          queryFields={queryFields}
        />
      </Box>
    </Box>
  );
}
