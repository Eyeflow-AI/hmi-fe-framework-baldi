import React, { useEffect, useState, Fragment } from "react";

//Design
import {Box, Select, Autocomplete} from "@mui/material";

//Internal
import PageWrapper from "../../components/PageWrapper";
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

export default function ImagesViewer({ pageOptions }) {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { _id: stationId } = GetSelectedStation();
  const [queryParams, setQueryParams] = useState(null);
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

  const [filesList, setFilesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState("");

  const dirPath = `/opt/eyeflow/images/${day}`;
  const getFolderList = () => {
    API.get.folderListImages({ params: {dirPath, fileURL: true } }, setLoading)
      .then((data) => {
        setFilesList(data.files);
        console.log(data.files);
      })
  }

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
              <Box id="menu-box" height={height}
                sx={{
                  bgcolor: "background.paper",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/*<Autocomplete
                  autoComplete
                  label="Date"
                  value={""}
                  onChange={(e) => { console.log(e.target.value); }}
                  inputProps={{
                    name: "date",
                    id: "date",
                  }}
                >
                  <option aria-label="None" value="" />
                  <option value={20240228}>20240228</option>
                </Autocomplete>*/}
                <Select
                  native
                  value={""}
                  onChange={(e) => { setDay(e.target.value); }}
                  inputProps={{
                    name: "date",
                    id: "date",
                  }}
                >
                  <option aria-label="None" value="" />
                  <option value={20240228}>20240228</option>
                </Select>
              </Box>
            </Box>
            <Box id="monitor-data-box" sx={style.dataBox}>
              <Box
                sx={{
                  display: "flex",
                }}
              >
              </Box>
              <Box
                display="flex"
                height={height}
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
        onClickSend={onClickSendBatchData}
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
