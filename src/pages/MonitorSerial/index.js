import React, { useEffect, useRef, useState } from "react";

//Design
import Box from "@mui/material/Box";

//Internal
import PageWrapper from "../../components/PageWrapper";
import EventHeader from "../../components/EventHeader";
import EventAppBar from "../../components/EventAppBar";
import EventMenuBox from "../../components/EventMenuBox";
import EventSerialDataBox from "../../components/EventSerialDataBox";
import GetSerialList from "../../utils/Hooks/GetSerialList";
import GetRunningSerial from "../../utils/Hooks/GetRunningSerial";

import GetSelectedStation from "../../utils/Hooks/GetSelectedStation";
import API from "../../api";

const style = {
  mainBox: {
    display: "flex",
    overflow: "hidden",
  },
  dataBox: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    marginLeft: 1,
    gap: 1,
  },
};

export default function Monitor({ pageOptions }) {
  const { _id: stationId } = GetSelectedStation();
  const [queryParams, setQueryParams] = useState(null);
  // eslint-disable-next-line
  const {
    serialList,
    loading: loadingSerialList,
    loadSerialList,
  } = GetSerialList({
    stationId,
    queryParams,
    sleepTime: pageOptions.options.getEventSleepTime,
    automaticUpdate: pageOptions.options.automaticUpdate,
  });
  // eslint-disable-next-line
  const { runningSerial, loadRunningSerial } = GetRunningSerial({
    stationId,
    sleepTime: pageOptions.options.getEventSleepTime,
    automaticUpdate: pageOptions.options.automaticUpdate,
  });

  const [selectedSerial, setSelectedSerial] = useState(null);
  // eslint-disable-next-line
  const [selectedSerialCountData, setSelectedSerialCountData] = useState(null);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [keepRunningEvent, setKeepRunningEvent] = useState(true);

  const serialListRef = useRef(serialList);

  const setSerialListRef = (data) => {
    serialListRef.current = data;
  };

  useEffect(() => {
    setSerialListRef(serialList);
  }, [serialList]);

  const onChangeEvent = (serialId, changedSerial = true) => {
    let collection = "inspection_events";
    if (serialId === runningSerial?._id) {
      collection = "staging_events";
    }
    if (changedSerial) {
      setSelectedSerial(null);
      setLoadingSelected(true);
    }
    if (serialId) {
      API.get
        .serial({ stationId, serialId, collection })
        .then((data) => {
          setSelectedSerial(data?.serial ?? null);
          setSelectedSerialCountData(data?.countData ?? null);
        })
        .catch(console.error)
        .finally(() => {
          setLoadingSelected(false);
        });
    }
  };

  const onChangeEventByClick = (serialId, changedSerial = true) => {
    setKeepRunningEvent(false);
    let collection = "inspection_events";
    if (serialId === runningSerial?._id) {
      collection = "staging_events";
    }
    if (changedSerial) {
      setSelectedSerial(null);
      setLoadingSelected(true);
    }
    if (serialId) {
      API.get
        .serial({ stationId, serialId, collection })
        .then((data) => {
          setSelectedSerial(data?.serial ?? null);
          setSelectedSerialCountData(data?.countData ?? null);
        })
        .catch(console.error)
        .finally(() => {
          setLoadingSelected(false);
        });
    }
  };
  useEffect(() => {
    if (!selectedSerial && runningSerial) {
      onChangeEvent(runningSerial._id);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      Object.keys(selectedSerial ?? {}).length > 0 &&
      selectedSerial?._id === runningSerial?._id
    ) {
      updateAll(selectedSerial);
    }
    if (
      runningSerial &&
      keepRunningEvent &&
      selectedSerial?._id !== runningSerial?._id
    ) {
      onChangeEvent(runningSerial?._id);
    }
    // eslint-disable-next-line
  }, [runningSerial]);

  useEffect(() => {
    if (
      Object.keys(selectedSerial ?? {}).includes("_id") &&
      Object.keys(runningSerial ?? {}).includes("_id") &&
      selectedSerial?._id === runningSerial?._id
    ) {
      setKeepRunningEvent(true);
      // countParamsChange.current = 0;
    }
    // eslint-disable-next-line
  }, [selectedSerial]);
  // useEffect(() => {console.log({runningBatch})}, [runningBatch]);
  useEffect(() => {
    if (
      selectedSerial &&
      selectedSerial._id !== runningSerial?._id &&
      serialList.findIndex((el) => el._id === selectedSerial._id) === -1
    ) {
      setSelectedSerial(null);
      // setSelectedSerialCountData(null);
    }
    if (
      !selectedSerial &&
      serialList.length > 0 &&
      !runningSerial &&
      keepRunningEvent
    ) {
      onChangeEvent(serialListRef.current[0]?._id ?? null, true);
    }
    if (
      Object.keys(selectedSerial ?? {}).length > 0 &&
      serialList.length > 0 &&
      !runningSerial &&
      keepRunningEvent
    ) {
      onChangeEvent(serialListRef.current[0]?._id ?? null, true);
    }
    // eslint-disable-next-line
  }, [serialListRef.current]);

  useEffect(() => {
    if (queryParams && queryParams.station !== stationId) {
      setQueryParams((params) => Object.assign({}, params));
    }
  }, [stationId, queryParams]);

  const onChangeParams = (newValue, deleteKeys = []) => {
    // countParamsChange.current++;
    if (
      newValue.hasOwnProperty("manualChanging") &&
      newValue.manualChanging === true
    ) {
      delete newValue.manualChanging;
      console.log("manualChanging");
      setKeepRunningEvent(false);
    }
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

  const onClickCreateBatch = () => {
    console.log("onClickCreateSerial");
  };

  const updateAll = (selectedSerial) => {
    if (selectedSerial) {
      onChangeEvent(selectedSerial._id, false);
    }
  };

  const onClickPause = () => {
    if (selectedSerial) {
      API.put
        .serialPause({ stationId, serialId: selectedSerial._id })
        .then((data) => {
          console.log("serial paused");
          updateAll(selectedSerial);
        })
        .catch(console.error);
    }
  };

  // console.log({selectedSerial})

  const onClickResume = () => {
    if (selectedSerial) {
      API.put
        .serialResume({ stationId, serialId: selectedSerial._id })
        .then((data) => {
          console.log("serial resumed");
          updateAll(selectedSerial);
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    if (selectedSerial) {
      updateAll(selectedSerial);
    }
    // eslint-disable-next-line
  }, [serialList]);

  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box width={width} height={height} sx={style.mainBox}>
          <EventMenuBox
            type="serial"
            width={pageOptions.options.eventMenuWidth}
            onClickCreateBatch={onClickCreateBatch}
            runningEvent={runningSerial}
            events={serialList}
            loadingData={loadingSerialList}
            selectedEventId={selectedSerial?._id ?? null}
            onChangeEventByClick={onChangeEventByClick}
            onChangeEvent={onChangeEvent}
            queryParams={queryParams}
            onChangeParams={onChangeParams}
            config={pageOptions.components.EventMenuBox}
            height={height}
            keepRunningEvent={keepRunningEvent}
          />
          <Box id="monitor-data-box" sx={style.dataBox}>
            <EventHeader
              data={selectedSerial}
              disabled={!selectedSerial}
              config={pageOptions.components.EventHeader}
            />
            <Box
              display="flex"
              height={height - pageOptions.components.EventHeader.height}
            >
              <EventAppBar
                data={selectedSerial}
                disabled={!selectedSerial}
                config={pageOptions.components.EventAppBar}
                onClickPause={onClickPause}
                onClickResume={onClickResume}
              />
              <EventSerialDataBox
                data={selectedSerial}
                disabled={!selectedSerial}
                config={pageOptions.components.EventSerialDataBox}
                appBarHeight={pageOptions.components.EventAppBar.height}
                loading={loadingSelected}
                runningSerial={runningSerial}
              />
            </Box>
          </Box>
        </Box>
      )}
    </PageWrapper>
  );
}
