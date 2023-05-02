// React
import React, { useEffect, useState } from 'react';

// Design
import { Grid, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { t } from 'i18next';
import { colors } from 'sdk-fe-eyeflow';

// Internal
import ImageDialog from './imageDialog';

// Third-party

function createData(element, predicted, detected) {
  return { element, predicted, detected };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0),
  createData('Ice cream sandwich', 237, 9.0),
  createData('Eclair', 262, 16.0),
  createData('Cupcake', 305, 3.7),
  createData('Gingerbread', 356, 16.0),
];

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


const styleSx = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, { opacity: 0.8 }),
};

export default function EventSerialDataBox({ data, config, disabled, appBarHeight }) {

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
          if (detected < predicted) {
            _document.ok = false;
          }
          _document.tableInfo.push([element, predicted, detected])
        })
      })
      setInspections(documents);
    }
  }, [data]);

  useEffect(() => {
    if (!openDialog) {
      setDialogTitle('');
    }
  }, [openDialog]);

  return (
    <Grid
      width={config.width}
      height={appBarHeight - config.height}
      sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}
      container
    >
      {
        inspections.map((inspection) => (
          <Grid
            item
            key={inspection._id}
            xs={6}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backgroundColor: inspection.ok ? colors.statuses['ok'] : colors.statuses['ng'],
            }}
          >
            <Typography textAlign={'center'} textTransform={'uppercase'}>
              {inspection.event_data.scan_data.surface}
            </Typography>
            <img
              src="/assets/cat.webp"
              style={{
                objectFit: 'contain',
                width: "calc(2560px * 0.15)",
                display: 'block',
                margin: 'auto',
                paddingBottom: '.5rem',
                cursor: 'pointer',
              }}
              alt="Inspection"
              onClick={() => { setOpenDialog(true); setDialogTitle(inspection.event_data.scan_data.surface) }}
            />
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
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row[0]}
                      </TableCell>
                      <TableCell align="right">{row[1]}</TableCell>
                      <TableCell align="right">{row[2]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ))
      }

      <ImageDialog
        open={openDialog}
        setOpen={setOpenDialog}
        imagePath={'/assets/cat.webp'}
        title={dialogTitle}
      />
    </Grid>
  )
};