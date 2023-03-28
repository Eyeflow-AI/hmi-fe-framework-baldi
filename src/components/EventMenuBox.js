// React
import React, {useEffect, useState} from 'react';


import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';


import colors from 'sdk-fe-eyeflow/functions/colors';
import dateFormat from 'sdk-fe-eyeflow/functions/dateFormat';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useTranslation } from "react-i18next";


import getQueryDateString from '../utils/functions/getQueryDateString';


const styleSx = {
  mainBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  filterBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingLeft: 1,
    paddingRight: 1,
    paddingTop: 1,
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
    borderRadius: 1,
    cursor: 'pointer',
    color: 'white',
    textShadow: '1px 1px 2px #404040',
    '&:hover': {
      boxShadow: (theme) => `${theme.shadows[3]}, inset 0 0 0 2px black`,
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
    height: "auto", width: "100%" //TODO: Fix height in Fire Fox
  },
  itemFooter: {
    paddingBottom: 0.2,
  },
}

styleSx.selectedItemSx = Object.assign({}, styleSx.itemSx, {
  boxShadow: (theme) => `${theme.shadows[2]}, inset 0 0 0 2px black`,
});

export default function EventMenuList({
  type,
  events,
  selectedEvent,
  queryParams,
  onChangeParams,
  onChangeEvent,
  config
}) {


  const { t } = useTranslation();

  const eventsLength = events?.length ?? 0;
  const [dateValue, setDateValue] = useState(new Date());

  useEffect(() => { //Update query params
    onChangeParams({min_event_time: getQueryDateString(dateValue), max_event_time: getQueryDateString(dateValue, {dayTimeDelta: 1})});
  // eslint-disable-next-line
  }, [dateValue]);

  function ItemRenderer({ index, style }) {

    let dateField = config?.dateField ?? "event_time";

    let itemData = events[index];
    let selected = selectedEvent?._id === itemData._id;
    let eventIndex = itemData.index ?? 0;
    let thumbURL = itemData.thumbURL ?? '';
    let thumbStyle = Boolean(itemData.thumbStyle) ? itemData.thumbStyle : styleSx.itemImage;
    let status = itemData.status ?? '';
    let eventTimeString = Boolean(itemData[dateField]) ? dateFormat(itemData[dateField]) : "";
    // let [dateString, timeString] = eventTimeString.split(" ");
    let id = itemData.id ?? '';
    // let conformity = Boolean(itemData.conformity);

    let boxStyle = Object.assign(
      {backgroundColor: selected ? colors.statuses[status] : `${colors.statuses[status]}90`},
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
            <img alt="" src={thumbURL} style={thumbStyle}/>
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

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
  };

  return (
    <Box id="event-menu-box" sx={styleSx.mainBox}>
      <Box id="filter-box" sx={styleSx.filterBox} >
        <DesktopDatePicker
          label={t("date")}
          inputFormat="yyyy/MM/dd"
          value={dateValue}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
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
