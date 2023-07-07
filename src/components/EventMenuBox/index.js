// React
import React, { useEffect, useState, useMemo } from 'react';


//Design
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

//Internal
import EventMenuItem from './EventMenuItem';
import EventMenuList from './EventMenuList';
import FilterBox from './FilterBox';

//Third-party
import { useTranslation } from "react-i18next";
import { colors } from 'sdk-fe-eyeflow';

const styleSx = {
  mainBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: 1
  },
  defaultBox: { bgcolor: "white", borderRadius: 1 },
  createBatchButton: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'primary.main',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  createSerialButton: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'primary.main',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  createBatchButtonIcon: {
    height: 30,
    width: 30,
    filter: 'invert(1)',
    marginBottom: '8px'
  },
  createSerialButtonIcon: {
    height: 30,
    width: 30,
    filter: 'invert(1)',
    marginBottom: '8px'
  },
  noEventBox: {
    bgcolor: colors.eyeflow.yellow.dark,
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  }
  ),
}

export default function EventMenuBox({
  type,
  onClickCreateBatch,
  height,
  width,
  runningEvent,
  events,
  selectedEventId,
  queryParams,
  loadingData,
  onChangeParams,
  onChangeEvent,
  config
}) {

  const { t } = useTranslation();

  const { itemMenuHeight, buttonBoxHeight, hasMainButton, queryFields, dateField } = useMemo(() => {
    const itemMenuHeight = config?.itemHeight ?? 200;
    return {
      itemMenuHeight,
      buttonBoxHeight: itemMenuHeight + 10,
      hasMainButton: config?.hasMainButton ?? true,
      queryFields: config?.queryFields ?? [],
      dateField: config?.dateField ?? "event_time",
    }
  }, [config]);


  const startBatchIcon = config?.startBatchIcon;
  const startSerialIcon = config?.startSerialIcon;
  const noEventIcon = config?.noEventIcon;
  const conveyorIcon = config?.conveyorIcon;

  const [menuBoxHeight, setMenuBoxHeight] = useState(height);

  const onEventClick = (eventData) => () => onChangeEvent(eventData._id);

  useEffect(() => {
    if (hasMainButton) {
      setMenuBoxHeight(height - buttonBoxHeight);
    }
    else {
      setMenuBoxHeight(height);
    }
  }, [height, hasMainButton, buttonBoxHeight])

  useEffect(() => {
    if (runningEvent?._id !== selectedEventId) {
      onChangeEvent(null);
    }
  }, [queryParams])

  return (
    <Box id="event-menu-box" width={width} sx={styleSx.mainBox}>
      {hasMainButton && (
        <>
          {type === "batch" && (
            <Box height={buttonBoxHeight} sx={styleSx.defaultBox}>
              {runningEvent
                ? (
                  <EventMenuItem
                    index={null}
                    dateField={dateField}
                    eventData={runningEvent}
                    selected={runningEvent._id === selectedEventId}
                    onClick={onEventClick(runningEvent)}
                    conveyorIcon={conveyorIcon}
                  />
                )
                : (
                  <ButtonBase>
                    <Box height={buttonBoxHeight} width={width} onClick={onClickCreateBatch} sx={styleSx.createBatchButton}>
                      <img alt="" src={startBatchIcon} style={styleSx.createBatchButtonIcon} />
                      {t("new_batch")}
                    </Box>
                  </ButtonBase>
                )
              }
            </Box>
          )}

          {type === "serial" && (
            <Box height={buttonBoxHeight} sx={styleSx.defaultBox}>
              {runningEvent
                ? (
                  <EventMenuItem
                    index={null}
                    dateField={dateField}
                    eventData={runningEvent}
                    selected={runningEvent._id === selectedEventId}
                    onClick={onEventClick(runningEvent)}
                    conveyorIcon={conveyorIcon}
                  />
                )
                :
                (
                  config?.trigger === 'manual' ?
                    <ButtonBase>
                      <Box height={buttonBoxHeight} width={width} onClick={onClickCreateBatch} sx={styleSx.createSerialButton}>
                        <img alt="" src={startSerialIcon} style={styleSx.createSerialButtonIcon} />
                        {t("start")}
                      </Box>
                    </ButtonBase>
                    :
                    <Box
                      height={buttonBoxHeight}
                      width={width}
                      sx={styleSx.noEventBox}
                    >
                      <img alt="" src={noEventIcon} style={styleSx.createSerialButtonIcon} />
                      {t("no_running_event")}
                    </Box>
                )
              }
            </Box>
          )
          }
        </>
      )}

      <Box id="menu-box" height={menuBoxHeight} sx={styleSx.menuBox} >
        <FilterBox onChangeParams={onChangeParams} queryFields={queryFields} />
        <EventMenuList
          events={events}
          selectedEventId={selectedEventId}
          loadingData={loadingData}
          onChangeEvent={onChangeEvent}
          dateField={dateField}
          itemMenuHeight={itemMenuHeight}
          conveyorIcon={conveyorIcon}
        />
      </Box>
    </Box>
  );
};