// React
import React, { useEffect, useState, useMemo } from "react";

//Design
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";

//Internal
import FilterBox from "../../../../componentsStore/Box/FilterBox";
import EventMenuItem from "./EventMenuItem";
import fetchJson from "../../../../utils/functions/fetchJson";
import { monitorSlice } from "../../../../store/slices/monitor";
import GetSelectedStation from "../../../../utils/Hooks/GetSelectedStation";
import CarouselWithQuery from "../../../../componentsStore/Carousel/CarouselWithQuery";
import GetComponentData from "../../../../utils/Hooks/GetComponentData";

//Third-party
import { useTranslation } from "react-i18next";
import { colors } from "sdk-fe-eyeflow";
import { useDispatch, useSelector } from "react-redux";

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
  const [selectedItemId, setSelectedItemId] = useState(null);

  const { _id: stationId } = GetSelectedStation();

  const [queryParams, setQueryParams] = useState(null);

  const dispatch = useDispatch();
  const state = useSelector((state) => state.monitor);
  const { t } = useTranslation();

  const {
    itemMenuHeight,
    buttonBoxHeight,
    hasMainButton,
    queryFields,
    dateField,
    component,
    conveyorComponent,
  } = useMemo(() => {
    const itemMenuHeight = config?.itemHeight ?? 200;
    return {
      itemMenuHeight,
      buttonBoxHeight: itemMenuHeight + 10,
      hasMainButton: config?.hasMainButton ?? true,
      queryFields: config?.queryFields ?? [],
      dateField: config?.dateField ?? "event_time",
      component: config?.component ?? "eventMenuBox",
      conveyorComponent: config?.conveyorComponent ?? "eventMenuList",
    };
  }, [config]);

  const startIcon = config?.startIcon;
  const conveyorIcon = config?.conveyorIcon;

  const { response, loading, loadResponse } = GetComponentData({
    component: component,
    query: { limit: 10, test: new Date() },
    stationId,
    run: true,
    sleepTime: 5000,
  });

  const [menuBoxHeight, setMenuBoxHeight] = useState(height);

  useEffect(() => {
    if (hasMainButton) {
      setMenuBoxHeight(height - buttonBoxHeight);
    } else {
      setMenuBoxHeight(height);
    }
  }, [height, hasMainButton, buttonBoxHeight]);

  const onChangeParams = (newValue, deleteKeys = []) => {
    setQueryParams((params) => {
      let newParams = Boolean(params) ? { ...params } : {};
      Object.assign(newParams, newValue);
      if (!newParams.hasOwnProperty("station")) {
        newParams["station"] = stationId;
      }
      for (let key of deleteKeys) {
        delete newParams[key];
      }
      return newParams;
    });
  };

  const handleSelectItem = (itemId) => {
    setSelectedItemId(itemId);
  };

  useEffect(() => {
    if (queryParams && queryParams.station !== stationId) {
      setQueryParams((params) => Object.assign({}, params));
    }
  }, [stationId, queryParams]);

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
        <CarouselWithQuery
          height={menuBoxHeight}
          width={width}
          config={config}
          queryFields={queryFields}
          defaultIcon={conveyorIcon}
          onChangeParams={onChangeParams}
          data={response?.find((item) => item.name === conveyorComponent) ?? []}
          name={conveyorComponent}
          onClick={handleSelectItem}
          selectedItemId={selectedItemId}
        />
      </Box>
    </Box>
  );
}
