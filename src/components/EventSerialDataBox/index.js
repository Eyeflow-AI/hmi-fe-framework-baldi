// React
import React, { useEffect, useState, Fragment } from 'react';

// Design
import { CircularProgress, Grid, Typography, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// Internal
import { TableView } from './views';

// Third-party
import { t } from 'i18next';
import { colors } from 'sdk-fe-eyeflow';

const mainBoxSx = Object.assign({}, window.app_config.style.box, {
  bgcolor: 'background.paper',
  // display: 'flex',
  alignItems: 'stretch',
  // justifyContent: 'stretch',
  flexDirection: 'column',
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
  , loading
}) {

  const [inspections, setInspections] = useState([]);
  const [buckets, setBuckets] = useState({});

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
          return VIEWS.TABLE_VIEW({ inspections: value, config });
        }
      });
      setInspections(_inspections);
    }
    else {
      setInspections([]);
    }
  }, [buckets]);

  return (
    <Box
      width={config.width}
      height={appBarHeight - config.height}
      sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}
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
              inspections.map((inspection, index) => {
                return (
                  <Fragment key={index}>
                    {inspection}
                  </Fragment>
                )
              })
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