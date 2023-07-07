// React
import React, { Fragment } from 'react';


//Design
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

//Internal
import EventMenuItem from './EventMenuItem';

//Third-party
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useTranslation } from "react-i18next";

const styleSx = {
  listBox: {
    height: '100%',
    boxShadow: 'inset 0 2px 4px #00000040',
    margin: 1,
    alignItems: 'center',
    borderRadius: window.app_config.style.box.borderRadius,
    bgcolor: 'background.paperLighter',
  },
}

export default function EventMenuList({
  events,
  selectedEventId,
  loadingData,
  onChangeEvent,
  dateField,
  itemMenuHeight,
  conveyorIcon,
}) {

  const { t } = useTranslation();

  const eventsLength = events?.length ?? 0;

  const onEventClick = (eventData) => () => onChangeEvent(eventData._id);

  function ItemRenderer({ index, style }) {

    let eventData = events[index];
    let eventIndex = eventData?.index ?? 0;
    let selected = selectedEventId === eventData._id;
    const customStyle = Object.assign(
      { display: 'flex', justifyContent: 'center', paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2 },
      style
    );

    return (
      <div
        key={`item-${index}`}
        style={customStyle}
      >
        <EventMenuItem
          index={eventIndex}
          dateField={dateField}
          eventData={eventData}
          selected={selected}
          onClick={onEventClick(eventData)}
          conveyorIcon={conveyorIcon}
        />
      </div>
    )
  };

  return (
    <Box id="list-box" sx={styleSx.listBox}>
      {(eventsLength === 0 && loadingData)
        ? (
          <Box height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            {`${t('loading')}...`}
            <CircularProgress />
          </Box>
        )
        : (
          <Fragment>
            {eventsLength === 0
              ? (
                <Box height="100%" display="flex" justifyContent="center" alignItems="center">
                  {t("no_data")}
                </Box>
              )
              : (
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      height={height}
                      width={width}
                      itemSize={itemMenuHeight}
                      itemCount={eventsLength}
                    >
                      {ItemRenderer}
                    </List>
                  )}
                </AutoSizer>
              )
            }
          </Fragment>
        )
      }
    </Box>
  );
};