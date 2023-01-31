// React
import React, {useMemo} from 'react';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';


import { colors } from 'sdk-fe-eyeflow';
import dateFormat from '../utils/dateFormat';


const ITEM_HEIGHT = 120;

const itemSx = {
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
    boxShadow: (theme) => `${theme.shadows[2]}, inset 0 0 0 2px blue`,
  },
};

const selectedItemSx = Object.assign({}, itemSx, {
  boxShadow: (theme) => `${theme.shadows[2]}, inset 0 0 0 2px blue`,
});

export default function EventMenuList({
  width,
  events,
  selectedEvent,
  onChangeItem,
}) {


  const eventsLength = events?.length ?? 0;

  function ItemRenderer({ index, style }) {

    const {itemData, boxStyle, partNumber, sequential, event_time} = useMemo(() => {
      let itemData = events[index];
      let selected = selectedEvent?._id === itemData._id;
      let conformity = itemData.conformity;
      let boxStyle = Object.assign(
        {backgroundColor: conformity ? colors.green : colors.red},
        selected ? selectedItemSx : itemSx
      );

      return {
        itemData,
        boxStyle,
        partNumber: itemData.partNumber ?? '',
        batch: itemData.batch ?? '',
        sequential: itemData.sequential ?? '',
        event_time: dateFormat(itemData.event_time),
      }
    }, [index])

    const customStyle = useMemo(() => Object.assign(
      {display: 'flex', justifyContent: 'center', padding: 4},
      style
    ), [style]);

    const onItemClick = () => onChangeItem(itemData._id);

    return (
      <div key={`item-${index}`} style={customStyle}>
        <Box
          sx={boxStyle}
          onClick={onItemClick}
        >
          <Typography variant='h6'>
            {partNumber}
          </Typography>
          <Typography variant='h6'>
            {sequential}
          </Typography>
          <Typography>
            {event_time}
          </Typography>
        </Box>
      </div>
    )
  };

  return (
    <AutoSizer disableWidth>
      {({ height }) => (
      <List
        height={height}
        width={width}
        itemSize={ITEM_HEIGHT}
        itemCount={eventsLength}
      >
        {ItemRenderer}
      </List>
      )}
    </AutoSizer>
  );
};
