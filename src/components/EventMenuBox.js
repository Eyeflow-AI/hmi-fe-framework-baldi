// React
import React, {useMemo} from 'react';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';


import { colors } from 'sdk-fe-eyeflow';
import dateFormat from '../utils/dateFormat';


const EVENT_MENU_BOX_CONFIG = window.app_config.components.EventMenuBox;


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
    bgcolor: colors.eyeflow.blue.medium
  },
  itemSx: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: 2,
    width: '100%',
    height: '100%',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
    textShadow: '1px 1px #606060',
    '&:hover': {
      boxShadow: (theme) => `${theme.shadows[2]}, inset 0 0 0 2px black`,
    },
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

  const newConfig = useMemo(() => {
    return Object.assign({}, EVENT_MENU_BOX_CONFIG, config);
  }, [config]);

  function ItemRenderer({ index, style }) {

    let itemData = events[index];
    let selected = selectedEvent?._id === itemData._id;
    let event_index = itemData.index ?? 0;
    let event_time = dateFormat(itemData.event_time);
    let label = itemData.label ?? '';
    let conformity = Boolean(itemData.conformity);
    let boxStyle = Object.assign(
      {backgroundColor: conformity ? colors.green : colors.red},
      selected ? styleSx.selectedItemSx : styleSx.itemSx
    );

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
          <Typography variant='h6'>
            {event_index}
          </Typography>
          <Typography>
            {event_time}
          </Typography>
          <Typography>
            {label}
          </Typography>
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
            itemSize={newConfig.itemHeight}
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
