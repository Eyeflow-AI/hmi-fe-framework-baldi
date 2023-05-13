// React
import React, { useEffect, useState } from 'react';

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
import ImageDialog from '../ImageDialog';

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

const GRID_SIZES = {
  1: 12,
  2: 12,
  3: 6,
  4: 6,
  5: 6,
  6: 6,
}

const IMAGE_SIZES = {
  1: '900px',
  2: '600px',
  3: '370px',
  4: '370px',
  5: '370px',
  6: '370px',
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
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');

  useEffect(() => {
    if (data) {
      const { documents } = data;
      documents.forEach((_document) => {
        _document.tableInfo = [];
        _document.ok = true;
        Object.entries(_document.event_data.part_data.required).forEach(([key, value]) => {
          let element = value.label;
          let detected = _document.event_data.scan_data.all_detections.filter((el) => el.class === key).length;
          let predicted = value.qtt;
          let classResult = detected === predicted ? true : false;
          if (detected < predicted) {
            _document.ok = false;
          }
          _document.tableInfo.push([element, predicted, detected, classResult])
        })
      })
      setInspections(documents);
    }
    else {
      setInspections([]);
    }
  }, [data]);

  useEffect(() => {
    if (!openDialog) {
      setDialogTitle('');
    }
  }, [openDialog]);

  return (
    <Box
      width={config.width}
      height={appBarHeight - config.height}
      sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}
    >
      <Grid
        container
        height='100%'
        spacing={1}
        direction="column"
        justifyContent="center"
        alignItems="space-evenly"
      >
        {
          !loading && inspections.length > 0 ?
            inspections.map((inspection) => (
              <Grid
                item
                key={inspection._id}
                xs={GRID_SIZES[inspections.length]}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  // height: '100%',
                  backgroundColor: inspection.ok ? `${colors.statuses['ok']}50` : `${colors.statuses['ng']}50`,
                  // opacity: 0.8,
                  border: `.02rem solid ${colors.eyeflow.blue.medium}`,
                }}
              >
                <Typography textAlign={'center'} textTransform={'uppercase'}>
                  {inspection.event_data.scan_data.surface}
                  &nbsp;&nbsp;
                  <span
                    style={{
                      color: inspection.ok ? colors.green : colors.red,
                      fontWeight: 'bold',
                    }}
                  >
                    {inspection.ok ? t('OK') : t('NG')}
                  </span>
                </Typography>
                <img
                  src="/assets/cat.webp"
                  style={{
                    objectFit: 'contain',
                    // width: "calc(2560px * 0.15)",
                    width: IMAGE_SIZES[inspections.length],
                    display: 'block',
                    margin: 'auto',
                    paddingBottom: '.5rem',
                    cursor: 'pointer',
                  }}
                  alt="Inspection"
                  onClick={() => { setOpenDialog(true); setDialogTitle(inspection.event_data.scan_data.surface) }}
                />
                <Box
                  sx={{
                    width: '100%',
                    height: inspections.length > 1 ? 'calc(100% - 256px)' : 'calc(100% - 128px)',
                    display: 'block',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="info table">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('element')}</TableCell>
                          <TableCell align="right">{t('predicted')}</TableCell>
                          <TableCell align="right">{t('detected')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inspection?.tableInfo.map((row) => (
                          <TableRow
                            key={row[0]}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                              backgroundColor: row[3] ? `${colors.statuses['ok']}70` : `${colors.statuses['ng']}70`,
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row[0]}
                            </TableCell>
                            <TableCell align="right">{row[1]}</TableCell>
                            <TableCell
                              align="right"
                            >
                              {row[2]}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            ))
            :
            (
              loading &&
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CircularProgress
                  sx={{
                    color: 'white',
                  }}
                  size='10rem'
                />
              </Box>
            )
        }

        <ImageDialog
          open={openDialog}
          setOpen={setOpenDialog}
          imagePath={'/assets/cat.webp'}
          title={dialogTitle}
        />
      </Grid>
    </Box>
  )
};