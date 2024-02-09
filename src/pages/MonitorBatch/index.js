import React, { useEffect, useState, Fragment } from "react";

//Design
import Box from "@mui/material/Box";

//Internal
import PageWrapper from "../../components/PageWrapper";
import EventHeader from "../../components/EventHeader";
import EventAppBar from "../../components/EventAppBar";
import EventMenuBox from "../../components/EventMenuBox";
import CreateBatchModal from "../../components/FormModal";
import PrintingDialog from "../../components/PrintingDialog";
import EventBatchDataBox from "../../components/EventBatchDataBox";
import GetBatchList from "../../utils/Hooks/GetBatchList";
import GetBatch from "../../utils/Hooks/GetBatch";
import GetRunningBatch from "../../utils/Hooks/GetRunningBatch";
import GetSelectedStation from "../../utils/Hooks/GetSelectedStation";
import API from "../../api";
import ERRORS from "../../errors";
import { setNotificationBar } from "../../store/slices/app";

// Third-party
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

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

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { _id: stationId } = GetSelectedStation();
  const [queryParams, setQueryParams] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [pauseLoading, setPauseLoading] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const [newBatchLoading, setNewBatchLoading] = useState(false);

  const {
    batchList,
    loading: loadingBatchList,
    loadBatchList,
  } = GetBatchList({
    stationId,
    queryParams,
    sleepTime: pageOptions.options.getEventSleepTime,
    automaticUpdate: pageOptions.options.automaticUpdate,
  });

  const {
    batchId,
    onChangeBatchId,
    batch: selectedBatch,
  } = GetBatch({ stationId, sleepTime: pageOptions.options.getEventSleepTime });
  const { runningBatch, loadRunningBatch } = GetRunningBatch({
    stationId,
    sleepTime: pageOptions.options.getEventSleepTime,
    automaticUpdate: pageOptions.options.automaticUpdate,
  });
  const isBatchRunning = Boolean(runningBatch);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const useMaskList = pageOptions.options.useMaskList ?? false;
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  useEffect(() => {
    if (!selectedBatch && runningBatch) {
      onChangeBatchId(runningBatch._id);
    }
    // eslint-disable-next-line
  }, [selectedBatch, runningBatch]);

  // useEffect(() => {console.log({runningBatch})}, [runningBatch]);
  useEffect(() => {
    if (selectedBatch) {
      let stationChanged = selectedBatch.station !== stationId;
      if (stationChanged) {
        onChangeBatchId(null);
      } else {
        let selectedBatchIsNotRunning = selectedBatch._id !== runningBatch?._id;
        let selectedBatchIsNotInBatchList =
          batchList.findIndex((el) => el._id === selectedBatch._id) === -1;
        if (selectedBatchIsNotRunning && selectedBatchIsNotInBatchList) {
          onChangeBatchId(null);
        }
      }
    }
    // eslint-disable-next-line
  }, [selectedBatch, batchList, runningBatch, stationId]);

  useEffect(() => {
    if (runningBatch?._id !== selectedBatch) {
      onChangeBatchId(null);
    }
  }, [queryParams]);

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

  const onClickCreateBatch = () => handleOpenCreateModal();
  const onClickSendBatchData = (data) => {
    API.post
      .batch({ stationId, data }, setNewBatchLoading)
      .then((data) => {
        setOpenCreateModal(false);
        updateAll();
      })
      .catch((err) => {
        if (err.code === ERRORS.EDGE_STATION_IS_NOT_REACHABLE) {
          dispatch(
            setNotificationBar({
              show: true,
              type: "error",
              message: "edge_station_is_not_reachable",
            })
          );
        } else {
          dispatch(
            setNotificationBar({
              show: true,
              type: "error",
              message: "internal_server_error",
            })
          );
        }
        console.error(err);
      });
  };

  const updateAll = () => {
    loadBatchList();
    loadRunningBatch();
    if (selectedBatch) {
      onChangeBatchId(selectedBatch._id);
    }
  };

  const onClickPause = () => {
    if (selectedBatch) {
      API.put
        .batchPause({ stationId, batchId: selectedBatch._id }, setPauseLoading)
        .then((data) => {
          console.log("batch paused");
          updateAll();
        })
        .catch(console.error);
    }
  };

  const onClickStop = () => {
    if (selectedBatch) {
      API.put
        .batchStop({ stationId, batchId: selectedBatch._id }, setStopLoading)
        .then((data) => {
          console.log("batch stopped");
          updateAll();
        })
        .catch(console.error);
    }
  };

  const onClickResume = () => {
    if (selectedBatch) {
      API.put
        .batchResume(
          { stationId, batchId: selectedBatch._id },
          setResumeLoading
        )
        .then((data) => {
          console.log("batch resumed");
          updateAll();
        })
        .catch((err) => {
          if (err.code === ERRORS.EDGE_STATION_IS_NOT_REACHABLE) {
            dispatch(
              setNotificationBar({
                show: true,
                type: "error",
                message: "edge_station_is_not_reachable",
              })
            );
          }
          console.error(err);
        });
    }
  };

  const onClickPrint = () => {
    setOpenPrintDialog(true);
  };

  const printFunction = (task) => {
    API.post
      .task({ stationId, task: task?.task })
      .then((data) => {
        dispatch(
          setNotificationBar({
            show: true,
            type: "success",
            message: t("task_created"),
          })
        );
        // updateAll();
      })
      .catch((err) => {
        if (err.code === ERRORS.EDGE_STATION_IS_NOT_REACHABLE) {
          dispatch(
            setNotificationBar({
              show: true,
              type: "error",
              message: "edge_station_is_not_reachable",
            })
          );
        }
        console.error(err);
      });
  };
  // console.log({selectedBatch})

  return (
    <Fragment>
      <PageWrapper>
        {({ width, height }) => (
          <Box width={width} height={height} sx={style.mainBox}>
            {/* <Box id="monitor-event-menu-box" width={pageOptions.options.eventMenuWidth}> */}
            <Box
              sx={{
                width: pageOptions.options.eventMenuWidth,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <EventMenuBox
                type="batch"
                width={pageOptions.options.eventMenuWidth}
                onClickCreateBatch={onClickCreateBatch}
                runningEvent={runningBatch}
                events={batchList}
                loadingData={loadingBatchList}
                selectedEventId={batchId}
                onChangeEventByClick={onChangeBatchId}
                queryParams={queryParams}
                onChangeParams={onChangeParams}
                config={pageOptions.components.EventMenuBox}
                height={height}
              />
            </Box>
            <Box id="monitor-data-box" sx={style.dataBox}>
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <EventAppBar
                  isBatchRunning={isBatchRunning}
                  data={selectedBatch}
                  disabled={!selectedBatch}
                  config={pageOptions.components.EventAppBar}
                  pauseLoading={pauseLoading}
                  onClickPause={onClickPause}
                  resumeLoading={resumeLoading}
                  onClickResume={onClickResume}
                  stopLoading={stopLoading}
                  onClickStop={onClickStop}
                  onClickPrint={onClickPrint}
                />
                <EventHeader
                  data={selectedBatch}
                  disabled={!selectedBatch}
                  config={pageOptions.components.EventHeader}
                />
              </Box>
              <Box
                display="flex"
                height={height - pageOptions.components.EventHeader.height}
              >
                <EventBatchDataBox
                  data={selectedBatch}
                  disabled={!selectedBatch}
                  config={pageOptions.components.EventBatchDataBox}
                />
              </Box>
            </Box>
          </Box>
        )}
      </PageWrapper>
      <CreateBatchModal
        config={pageOptions.components.CreateBatchModal}
        open={openCreateModal}
        handleClose={handleCloseCreateModal}
        sendLoading={newBatchLoading}
      />
      <PrintingDialog
        open={openPrintDialog}
        handleClose={() => setOpenPrintDialog(false)}
        printFunction={printFunction}
        handleCancel={() => setOpenPrintDialog(false)}
        data={selectedBatch}
      />
    </Fragment>
  );
}
