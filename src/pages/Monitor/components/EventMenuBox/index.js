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
import {
  CarouselWithQuery,
  CarouselItem,
} from "../../../../componentsStore/Carousel";
import GetComponentData from "../../../../utils/Hooks/GetComponentData";
import getComponentData from "../../../../utils/functions/getComponentData";

//Third-party
import { useTranslation } from "react-i18next";
import { colors } from "sdk-fe-eyeflow";

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

export default function EventMenuBox({
  height,
  width,
  config,
  selectedItem,
  setSelectedItem,
  setItemInfo,
  itemInfo,
  setRunningItem,
  runningItem,
  setDialogStartInfo,
  stationId,
}) {
  const [changeEventType, setChangeEventType] = useState("");

  const [queryParams, setQueryParams] = useState(null);

  const { t } = useTranslation();

  const {
    itemMenuHeight,
    buttonBoxHeight,
    hasMainButton,
    queryFields,
    dateField,
    component,
    conveyorComponent,
    runningItemComponent,
    conveyorComponentSleepTime,
    runningItemComponentSleepTime,
    loadStartInfoComponent,
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
      conveyorComponentSleepTime: config?.conveyorComponentSleepTime ?? 10000,
      runningItemComponent: config?.runningItemComponent ?? "runningItem",
      runningItemComponentSleepTime:
        config?.runningItemComponentSleepTime ?? 1000,
      loadStartInfoComponent: config?.loadStartInfoComponent ?? "loadStartInfo",
    };
  }, [config]);

  const startIcon = config?.startIcon;
  const conveyorIcon = config?.conveyorIcon;

  const { response, loading, loadResponse } = GetComponentData({
    component: component,
    query: { limit: 10, test: new Date() },
    stationId,
    run: true,
    sleepTime: conveyorComponentSleepTime,
  });

  const {
    response: runningItemResponse,
    loading: runningItemLoading,
    loadResponse: loadRunningItemResponse,
  } = GetComponentData({
    component: runningItemComponent,
    query: { limit: 10, test: new Date() },
    stationId,
    run: true,
    sleepTime: runningItemComponentSleepTime,
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

  const handleSelectItem = (item, type = "click") => {
    setSelectedItem(item);
    setChangeEventType(type);
  };

  useEffect(() => {
    if (queryParams && queryParams.station !== stationId) {
      setQueryParams((params) => Object.assign({}, params));
    }
  }, [stationId, queryParams]);

  useEffect(() => {
    if (
      changeEventType === "click" &&
      selectedItem &&
      selectedItem._id &&
      selectedItem?.on?.click
    ) {
      let query = selectedItem;
      let component = selectedItem.on.click;
      let result = null;
      getComponentData({
        query,
        component,
        stationId,
        // setLoading,
        setResponse: setItemInfo,
      });
    } else if (
      changeEventType === "update" &&
      selectedItem &&
      selectedItem._id &&
      selectedItem?.on?.update
    ) {
      let query = selectedItem;
      let component = selectedItem.on.update;
      getComponentData({
        query,
        component,
        stationId,
        // setLoading,
        setResponse: setItemInfo,
      });
    }

    if (changeEventType !== "") {
      setChangeEventType("");
    }
  }, [changeEventType]);

  useEffect(() => {
    let _runningItem =
      runningItemResponse?.find((item) => item.name === runningItemComponent) ??
      null;

    if (JSON.stringify(_runningItem?.output) !== JSON.stringify(runningItem)) {
      setRunningItem(_runningItem?.output ?? null);
      if (_runningItem?.output?._id === selectedItem?._id) {
        handleSelectItem(_runningItem?.output, "update");
      }
    }

    // página carregada e sem item selecionado
    if (!selectedItem && _runningItem?.output) {
      handleSelectItem(_runningItem?.output, "update");
    }
  }, [runningItemComponent, runningItemResponse]);

  useEffect(() => {
    let item =
      response?.find((item) => item.name === conveyorComponent) ?? null;

    // página carregada e sem item selecionado
    if (!selectedItem && item?.output?.length > 0) {
      handleSelectItem(item.output[0], "update");
    } else if (selectedItem && item?.output?.length > 0) {
      let _item = item?.output?.find((item) => item?._id === selectedItem?._id);
      // página carregada e com item selecionado, mas o item não está na lista
      if (!_item && runningItem?._id !== selectedItem?._id) {
        handleSelectItem(_item?.output?.[0], "update");
      }
      // página carregada e com item selecionado, e o item está na lista
      else {
        if (
          JSON.stringify(_item) !== JSON.stringify(selectedItem) &&
          _item &&
          _item?._id &&
          selectedItem?._id &&
          _item?._id === selectedItem?._id
        ) {
          handleSelectItem(_item, "update");
        }
      }
    }
  }, [response, conveyorComponent]);

  const handleStart = () => {
    let query = {};
    let component = loadStartInfoComponent;

    getComponentData({
      query,
      component,
      stationId,
      // setLoading,
      setResponse: setDialogStartInfo,
    });
  };

  return (
    <Box id="event-menu-box" width={width} sx={styleSx.mainBox}>
      {hasMainButton && (
        <Box height={buttonBoxHeight} sx={styleSx.defaultBox}>
          {runningItem ? (
            <CarouselItem
              data={runningItem}
              conveyorIcon={conveyorIcon}
              selected={selectedItem?._id === runningItem?._id}
              onClick={() => handleSelectItem(runningItem, "click")}
            />
          ) : (
            <ButtonBase>
              <Box
                height={buttonBoxHeight}
                width={width}
                onClick={handleStart}
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
          selectedItem={selectedItem}
        />
      </Box>
    </Box>
  );
}
