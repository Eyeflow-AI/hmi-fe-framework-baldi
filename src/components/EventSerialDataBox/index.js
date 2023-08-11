// React
import React, { useEffect, useState, Fragment } from 'react';

// Design
import { Box } from '@mui/material';


// Internal
import { TableView } from './views';

// Third-party
import { t } from 'i18next';

const mainBoxSx = Object.assign({}, window.app_config.style.box, {
  bgcolor: 'background.paper',
  // display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // flexDirection: 'column',
  // gap: 0.25,
  overflowX: 'hidden',
  overflowY: 'hidden',
  // width: "100%",
  // flexWrap: "wrap",
  // whiteSpace: "pre-wrap", //TODO: Remove this line. Debug only
});

const VIEWS = {
  TABLE_VIEW: (props) => <TableView {...props} />,
}

const styleSx = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, { opacity: 0.8 }),
};

export default function EventSerialDataBox({
  data
  , config
  , disabled
  , appBarHeight
  , loading,
  runningSerial
}) {

  const [inspections, setInspections] = useState([]);
  const [buckets, setBuckets] = useState({});
  const [isSelectedSerialRunning, setIsSelectedSerialRunning] = useState(false);

  useEffect(() => {
    if (data) {
      const { inspectionsBuckets } = data;
      setBuckets(inspectionsBuckets ? { ...inspectionsBuckets } : {});
    }
    else {
      setInspections([]);
    }
  }, [data]);

  useEffect(() => {
    if (buckets) {
      const _inspections = Object.entries(buckets).map(([key, value]) => {
        if (key === 'table') {
          return VIEWS.TABLE_VIEW({ inspections: value, config, appBarHeight, isSelectedSerialRunning, serialId: data?._id });
        }
        else {
          return (<div>Not implemented yet</div>)
        }
      });
      setInspections(_inspections);
    }
    else {
      setInspections([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buckets]);

  useEffect(() => {
    setIsSelectedSerialRunning(runningSerial && runningSerial._id === data?._id);
  }, [runningSerial, data]);

  return (
    <Box
      width={config.width}
      height='100%'
      sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}
    // id="event-serial-data-box" 
    >
      {
        Object.keys(buckets).length === 1 &&

        <>
          {
            inspections.length === 0 ?
              <Box>
                {t('no_data')}
              </Box>
              :
              <Fragment>
                {inspections[0]}
              </Fragment>
          }
        </>
      }
      {
        Object.keys(buckets).length > 1 &&
        <>
          another view
        </>
      }

    </Box>
  )
};