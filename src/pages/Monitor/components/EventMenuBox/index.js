// React
import React, { useEffect, useState, useMemo } from "react";

//Design
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";

//Internal
import {
  CarouselWithQuery,
  CarouselItem,
} from "../../../../componentsStore/Carousel";
import getComponentData from "../../../../utils/functions/getComponentData";
import Clock from "../../../../utils/Hooks/Clock";
import lodash from "lodash";

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
  setLoadingSelectedItem,
  setLoadingList,
  loadingList,
}) {
  const [changeEventType, setChangeEventType] = useState("update");
  const [oldSelectedItem, setOldSelectedItem] = useState(null);

  const [queryParams, setQueryParams] = useState(null);

  // console.log({ queryParams });

  const { t } = useTranslation();

  const {
    // itemMenuHeight,
    buttonBoxHeight,
    hasMainButton,
    queryFields,
    // dateField,
    component,
    conveyorComponent,
    runningItemComponent,
    conveyorComponentSleepTime,
    runningItemComponentSleepTime,
    loadStartInfoComponent,
    trigger,
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
      trigger: config?.trigger ?? "person",
    };
  }, [config]);

  const startIcon = config?.startIcon;
  const conveyorIcon = config?.conveyorIcon;
  // const [clock, setClock] = useState(null);

  // console.log({ _memo2: conveyourClock });

  const { clock: conveyourClock } = Clock({
    sleepTime: conveyorComponentSleepTime,
  });
  const { clock: runningItemClock } = Clock({
    sleepTime: runningItemComponentSleepTime,
  });
  // useEffect(() => {
  //   setClock(conveyourClock);
  //   console.log({ _memo: conveyourClock });
  // }, [conveyourClock]);
  // eslint-disable-next-line
  const [response, setResponse] = useState(null);

  const handleResponse = (response, newResponse) => {
    if (!lodash.isEqual(response, newResponse)) {
      setResponse(newResponse);
    }
  };

  useEffect(() => {
    if (queryParams) {
      getComponentData({
        query: queryParams,
        component,
        stationId,
        setResponse: (newResponse) => handleResponse(response, newResponse),
      });
    }
    // console.log({ response });
    // setResponse(response);
    // eslint-disable-next-line
  }, [conveyourClock]);

  useEffect(() => {
    if (queryParams) {
      getComponentData({
        query: queryParams,
        component,
        stationId,
        setResponse: (newResponse) => handleResponse(response, newResponse),
        setLoading: setLoadingList,
      });
    }
    // console.log({ response });
    // setResponse(response);
    // eslint-disable-next-line
  }, [queryParams]);

  const [runningItemResponse, setRunningItemResponse] = useState(null);
  const handleRunningItemResponse = (response, newResponse) => {
    if (!lodash.isEqual(response, newResponse)) {
      setRunningItemResponse(newResponse);
    }
  };
  useEffect(() => {
    if (queryParams) {
      getComponentData({
        query: queryParams,
        component: runningItemComponent,
        stationId,
        setResponse: (newResponse) =>
          handleRunningItemResponse(runningItemResponse, newResponse),
      });
    }
    // eslint-disable-next-line
  }, [runningItemClock]);

  // const {
  //   response: runningItemResponse,
  //   // eslint-disable-next-line no-unused-vars
  //   loading: runningItemLoading,
  //   // eslint-disable-next-line no-unused-vars
  //   loadResponse: loadRunningItemResponse,
  // } = GetComponentData({
  //   component: runningItemComponent,
  //   query: { limit: 10, test: new Date() },
  //   stationId,
  //   run: false,
  //   sleepTime: runningItemComponentSleepTime,
  // });

  const [menuBoxHeight, setMenuBoxHeight] = useState(height);

  // console.log({ runningItem, runningItemResponse, runningItemComponent });

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
      // console.log({ newParams });
      return newParams;
    });
  };

  const handleSelectItem = (item, type = "click") => {
    setOldSelectedItem(selectedItem);
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
      // let result = null;
      getComponentData({
        query,
        component,
        stationId,
        setLoading: setLoadingSelectedItem,
        setResponse: setItemInfo,
      });
    } else if (
      changeEventType === "update" &&
      selectedItem &&
      selectedItem?._id &&
      selectedItem?.on?.update &&
      selectedItem?._id !== oldSelectedItem?._id
    ) {
      let query = selectedItem;
      let component = selectedItem.on.update;
      getComponentData({
        query,
        component,
        stationId,
        setLoading: setLoadingSelectedItem,
        setResponse: setItemInfo,
      });
    } else if (
      changeEventType === "update" &&
      selectedItem &&
      selectedItem?._id &&
      selectedItem?.on?.update &&
      selectedItem?._id === oldSelectedItem?._id
    ) {
      let query = selectedItem;
      let component = selectedItem.on.update;
      getComponentData({
        query,
        component,
        stationId,
        // setLoading: setLoadingSelectedItem,
        setResponse: setItemInfo,
      });
    }

    // if (changeEventType !== "") {
    //   setChangeEventType("update");
    // }
    // eslint-disable-next-line
  }, [changeEventType, selectedItem]);

  useEffect(() => {
    let _runningItem =
      runningItemResponse?.find((item) => item.name === runningItemComponent) ??
      null;
    // console.log({ _runningItem });

    if (JSON.stringify(_runningItem?.output) !== JSON.stringify(runningItem)) {
      setRunningItem(_runningItem?.output ?? null);
      // if (_runningItem?.output?._id === selectedItem?._id) {
      //   handleSelectItem(_runningItem?.output, "update");
      // }
    }

    // if (
    //   !_runningItem &&
    //   runningItem &&
    //   selectedItem?._id === runningItem?._id
    // ) {
    //   setSelectedItem(null);
    //   setItemInfo(null);
    // }

    // página carregada e sem item selecionado
    // if (!selectedItem && _runningItem?.output) {
    //   handleSelectItem(_runningItem?.output, "update");
    // }
    // eslint-disable-next-line
  }, [runningItemComponent, runningItemResponse]);

  useEffect(() => {
    let item =
      response?.find((item) => item.name === conveyorComponent) ?? null;

    // página carregada e sem item selecionado
    if (!selectedItem && item?.output?.length > 0) {
      handleSelectItem(item.output[0], "update");
    } else if (selectedItem && item?.output?.length > 0) {
      let _item = item?.output?.find((item) => item?._id === selectedItem?._id);
      // console.log({ _item });
      // página carregada e com item selecionado, mas o item não está na lista
      if (!_item && runningItem?._id !== selectedItem?._id) {
        handleSelectItem(_item?.output?.[0], "update");
      }
      // página carregada e com item selecionado, e o item está na lista
      else if (
        changeEventType === "update" &&
        item?.output?.[0]?._id !== selectedItem?._id
      ) {
        handleSelectItem(item?.output?.[0], "update");
      } else {
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
    // eslint-disable-next-line
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
          ) : trigger === "person" ? (
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
          ) : (
            <ButtonBase>
              <Box
                height={buttonBoxHeight}
                width={width}
                sx={styleSx.noEventBox}
              >
                {t("no_event_running")}
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
          loadingList={loadingList}
        />
      </Box>
    </Box>
  );
}
