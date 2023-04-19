import React, { useEffect, useState, Fragment } from 'react'


//Design
import Box from '@mui/material/Box';


//Internal
import PageWrapper from '../../components/PageWrapper';
import EventHeader from '../../components/EventHeader';
import EventAppBar from '../../components/EventAppBar';
import EventMenuBox from '../../components/EventMenuBox';
import FormModal from '../../components/FormModal';
import EventBatchDataBox from '../../components/EventBatchDataBox';
import GetBatchList from '../../utils/Hooks/GetBatchList';
import GetBatch from '../../utils/Hooks/GetBatch';
import GetRunningBatch from '../../utils/Hooks/GetRunningBatch';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import API from '../../api';


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

  const { _id: stationId } = GetSelectedStation();
  const [queryParams, setQueryParams] = useState(null);

  const { batchList, loading: loadingBatchList, loadBatchList } = GetBatchList({ stationId, queryParams, sleepTime: pageOptions.options.getEventSleepTime });

  const {batchId, onChangeBatchId, batch: selectedBatch} = GetBatch({ stationId, sleepTime: pageOptions.options.getEventSleepTime });
  const {runningBatch, loadRunningBatch} = GetRunningBatch({stationId, sleepTime: pageOptions.options.getEventSleepTime});

  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

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

  useEffect(() => {
    if (queryParams && queryParams.station !== stationId) {
      setQueryParams((params) => Object.assign({}, params, { station: stationId }));
    };
  }, [stationId, queryParams]);

  const onChangeParams = (newValue) => {
    setQueryParams((params) => {
      let newParams = Boolean(params) ? { ...params } : {};
      Object.assign(newParams, newValue);
      if (!newParams.hasOwnProperty("station")) {
        newParams["station"] = stationId;
      };
      return newParams;
    });
  };

  const onClickCreateBatch = () => handleOpenCreateModal();
  const onClickSendBranchData = (data) => console.log(data);

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
        .catch(console.error);
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
                selectedEvent={selectedBatch}
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
      <FormModal
        open={openCreateModal}
        handleClose={handleCloseCreateModal}
        onClickSend={onClickSendBranchData}
      />
    </Fragment>
  );
}
