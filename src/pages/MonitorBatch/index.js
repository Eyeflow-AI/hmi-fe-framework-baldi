import React, { useEffect, useState, Fragment } from 'react'


//Design
import Box from '@mui/material/Box';


//Internal
import PageWrapper from '../../components/PageWrapper';
import EventHeader from '../../components/EventHeader';
import EventAppBar from '../../components/EventAppBar';
import EventMenuBox from '../../components/EventMenuBox';
import CreateBatchModal from '../../components/FormModal';
import EventBatchDataBox from '../../components/EventBatchDataBox';
import GetBatchList from '../../utils/Hooks/GetBatchList';
import GetBatch from '../../utils/Hooks/GetBatch';
import GetRunningBatch from '../../utils/Hooks/GetRunningBatch';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import API from '../../api';
import ERRORS from '../../errors';
import { setNotificationBar } from '../../store/slices/app';

import { useDispatch } from 'react-redux';

const style = {
  mainBox: {
    display: 'flex',
    overflow: 'hidden',
  },
  dataBox: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: 1,
    gap: 1,
  },
};


export default function Monitor({pageOptions}) {

  const dispatch = useDispatch();

  const { _id: stationId } = GetSelectedStation();
  const [queryParams, setQueryParams] = useState(null);

  const { batchList, loading: loadingBatchList, loadBatchList } = GetBatchList({ stationId, queryParams, sleepTime: pageOptions.options.getEventSleepTime });

  const {batchId, onChangeBatchId, batch: selectedBatch} = GetBatch({ stationId, sleepTime: pageOptions.options.getEventSleepTime });
  const {runningBatch, loadRunningBatch} = GetRunningBatch({stationId, sleepTime: pageOptions.options.getEventSleepTime});
  const isBatchRunning = Boolean(runningBatch);

  const [openCreateModal, setOpenCreateModal] = React.useState(false);

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  useEffect(() => {
    if (!selectedBatch && runningBatch) {
      onChangeBatchId(runningBatch._id);
    };
    // eslint-disable-next-line
  }, [selectedBatch, runningBatch]);

  // useEffect(() => {console.log({runningBatch})}, [runningBatch]);
  useEffect(() => {
    if (selectedBatch) {
      let stationChanged = selectedBatch.station !== stationId;
      if (stationChanged) {
        onChangeBatchId(null);
      }
      else {
        let selectedBatchIsNotRunning = selectedBatch._id !== runningBatch?._id;
        let selectedBatchIsNotInBatchList = batchList.findIndex((el) => el._id === selectedBatch._id) === -1;
        if (selectedBatchIsNotRunning && selectedBatchIsNotInBatchList) {
          onChangeBatchId(null);
        }
      }
    }
    // eslint-disable-next-line
  }, [selectedBatch, batchList, runningBatch, stationId]);

  const onChangeParams = (newValue, deleteKeys=[]) => {
    setQueryParams((params) => {
      let newParams = Boolean(params) ? { ...params } : {};
      Object.assign(newParams, newValue);
      if (!newParams.hasOwnProperty("station")) {
        newParams["station"] = stationId;
      };
      for (let key of deleteKeys) {
        delete newParams[key];
      };
      return newParams;
    });
  };

  const onClickCreateBatch = () => handleOpenCreateModal();
  const onClickSendBatchData = (data) => {
    API.post.batch({ stationId, data })
      .then((data) => {
        console.log(data);
        setOpenCreateModal(false);
        updateAll();
      })
      .catch((err) => {
        if (err.code === ERRORS.EDGE_STATION_IS_NOT_REACHABLE) {
          dispatch(setNotificationBar({ show: true, type: 'error', message: "edge_station_is_not_reachable" }));
        }
        console.error(err);
      });
  };

  const updateAll = () => {
    loadBatchList();
    loadRunningBatch();
    if (selectedBatch) {
      onChangeBatchId(selectedBatch._id);
    };
  };

  const onClickPause = () => {
    if (selectedBatch) {
      API.put.batchPause({ stationId, batchId: selectedBatch._id })
        .then((data) => {
          console.log("batch paused");
          updateAll();
        })
        .catch(console.error);
    };
  };

  const onClickResume = () => {
    if (selectedBatch) {
      API.put.batchResume({ stationId, batchId: selectedBatch._id })
        .then((data) => {
          console.log("batch resumed");
          updateAll();
        })
        .catch((err) => {
          if (err.code === ERRORS.EDGE_STATION_IS_NOT_REACHABLE) {
            dispatch(setNotificationBar({ show: true, type: 'error', message: "edge_station_is_not_reachable" }));
          }
          console.error(err);
        });
    };
  };

  return (
    <Fragment>
      <PageWrapper>
        {({width, height}) => 
          <Box width={width} height={height} sx={style.mainBox}>
            {/* <Box id="monitor-event-menu-box" width={pageOptions.options.eventMenuWidth}> */}
              <EventMenuBox
                type="batch"
                width={pageOptions.options.eventMenuWidth}
                onClickCreateBatch={onClickCreateBatch}
                runningEvent={runningBatch}
                events={batchList}
                loadingData={loadingBatchList}
                selectedEventId={batchId}
                onChangeEvent={onChangeBatchId}
                queryParams={queryParams}
                onChangeParams={onChangeParams}
                config={pageOptions.components.EventMenuBox}
                height={height}
              />
            <Box id="monitor-data-box" sx={style.dataBox}>
              <EventHeader
                data={selectedBatch}
                disabled={!selectedBatch}
                config={pageOptions.components.EventHeader}
              />
              <Box
                display="flex"
                height={height - pageOptions.components.EventHeader.height}
              >
                <EventAppBar
                  isBatchRunning={isBatchRunning}
                  data={selectedBatch}
                  disabled={!selectedBatch}
                  config={pageOptions.components.EventAppBar}
                  onClickPause={onClickPause}
                  onClickResume={onClickResume}
                />
                <EventBatchDataBox
                  data={selectedBatch}
                  disabled={!selectedBatch}
                  config={pageOptions.components.EventBatchDataBox}
                />
              </Box>
            </Box>
          </Box>
      }
      </PageWrapper>
      <CreateBatchModal
        config={pageOptions.components.CreateBatchModal}
        open={openCreateModal}
        handleClose={handleCloseCreateModal}
        onClickSend={onClickSendBatchData}
      />
    </Fragment>
  );
}
