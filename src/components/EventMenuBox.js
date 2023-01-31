// React
import React, {useMemo} from 'react';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';


import { colors } from 'sdk-fe-eyeflow';
import dateFormat from 'sdk-fe-eyeflow/functions/dateFormat';


const styleSx = {
  mainBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  filterBox: {
    height: 200,
  },
  listBox: {
    height: '100%',
    boxShadow: 'inset 0 2px 4px #00000040',
    margin: 1,
    borderRadius: window.app_config.style.box.borderRadius,
    // bgcolor: colors.eyeflow.blue.medium
    bgcolor: '#DBDBDB'
  },
  itemSx: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 2,
    width: '100%',
    height: '100%',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
    textShadow: '1px 1px 2px #404040',
    '&:hover': {
      boxShadow: (theme) => `${theme.shadows[2]}, inset 0 0 0 2px black`,
    },
  },
  itemHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 1,
    paddingRight: 1,
  },
  itemImageBox: {
    paddingLeft: 1.5,
    paddingRight: 1.5,
  },
  itemImage: {
    height: "auto", width: "100%"
  },
  itemFooter: {
    paddingBottom: 0.2,
  },
}

styleSx.selectedItemSx = Object.assign({}, styleSx.itemSx, {
  boxShadow: (theme) => `${theme.shadows[2]}, inset 0 0 0 2px black`,
});

export default function EventMenuList({
  events,
  selectedEvent,
  onChangeEvent,
  config
}) {


  const eventsLength = events?.length ?? 0;

  function ItemRenderer({ index, style }) {

    let itemData = events[index];
    let selected = selectedEvent?._id === itemData._id;
    let eventIndex = itemData.index ?? 0;
    let thumbURL = itemData.thumbURL ?? '';
    let status = itemData.status ?? '';
    let eventTimeString = dateFormat(itemData.event_time, "default");
    let [dateString, timeString] = eventTimeString.split(" ");
    let id = itemData.id ?? '';
    let conformity = Boolean(itemData.conformity);
    let boxStyle = Object.assign(
      {backgroundColor: colors.statuses[status]},
      // {backgroundColor: conformity ? "#58DB99" : "#c63e4c"},
      selected ? styleSx.selectedItemSx : styleSx.itemSx
    );
    // "ok", "nok", "repaired", "unindentified"

    const customStyle = Object.assign(
      {display: 'flex', justifyContent: 'center', padding: 4},
      style
    );

    const onItemClick = () => onChangeEvent(itemData._id);

    return (
      <div key={`item-${index}`} style={customStyle}>
        <Box
          sx={boxStyle}
          onClick={onItemClick}
        >
          <Box sx={styleSx.itemHeader}>
            <Box>
              <Typography variant='h6'>
                {eventIndex}
              </Typography>
            </Box>
            <Box>
              <Typography variant='h6'>
                {id}
              </Typography>
            </Box>
          </Box>

          {thumbURL && (
          <Box sx={styleSx.itemImageBox}>
            <img alt="" src={thumbURL} style={styleSx.itemImage}/>
          </Box>
          )}
          
          <Box sx={styleSx.itemFooter}>
            <Typography variant="subtitle2">
              {eventTimeString}
            </Typography>
          </Box>
        </Box>
      </div>
    )
  };

  return (
    <Box id="event-menu-box" sx={styleSx.mainBox}>
      <Box id="filter-box" sx={styleSx.filterBox} >

      </Box>
      <Box id="list-box" sx={styleSx.listBox}>
        <AutoSizer>
          {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemSize={config?.itemHeight ?? 200}
            itemCount={eventsLength}
          >
            {ItemRenderer}
          </List>
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
};
