// React
import React, { useEffect, useState } from 'react';

// Design

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';


// Internal
import API from '../../../../api';
import getStationListThunk from '../../../../store/thunks/stationList';

// Third-Party
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';


export default function StationDialog({
  open
  , stations
  , onClose
  , title
  , selectedStationInfo = null
}) {


  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [parms, setParms] = useState('');
  const [edges, setEdges] = useState('');
  const [stationName, setStationName] = useState('');
  const [stationNameError, setStationNameError] = useState(false);
  const [parmsError, setParmsError] = useState(false);
  const [edgesError, setEdgesError] = useState(false);

  const handleClose = () => {
    setStationName('');
    setParms('');
    onClose(false);
  };

  const handleEditStation = () => {
    if (stationName && !stationNameError && !parmsError && !edgesError) {
      API.put.station({
        stationId: selectedStationInfo._id,
        stationName,
        parms,
        edges
      }).then(() => { })
        .catch(console.log)
        .finally(() => {
          dispatch(getStationListThunk());
          handleClose();
        });
    }
  };

  useEffect(() => {
    if (stationName) {
      setStationNameError(stations?.filter(station => station._id !== selectedStationInfo._id).find(station => station.label === stationName));
    }
    let stationname = stationName.replace(/\./g, '');
    setStationName(stationname);
  }, [stationName, stations]);

  useEffect(() => {
    if (parms) {
      try {
        JSON.parse(parms);
        setParmsError(false);
      } catch (e) {
        setParmsError(true);
      }
    }
  }, [parms]);

  useEffect(() => {
    if (edges) {
      try {
        JSON.parse(edges);
        if (!Array.isArray(JSON.parse(edges))) {
          setEdgesError(true);
        }
        else {
          setEdgesError(false);
        }
      } catch (e) {
        setEdgesError(true);
      }
    }
  }, [edges]);

  useEffect(() => {
    if (selectedStationInfo) {
      setStationName(selectedStationInfo.label);
      setParms(JSON.stringify(selectedStationInfo.parms, undefined, 4));
      setEdges(JSON.stringify(selectedStationInfo.edges, undefined, 4));
    }
  }, [selectedStationInfo]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t('label')}
          type="text"
          fullWidth
          error={stationNameError}
          helperText={stationNameError && t('cannot_repeat_station_name')}
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="parameters"
          label={t('parameters')}
          type="text"
          fullWidth
          multiline
          value={parms}
          error={parmsError}
          helperText={parmsError && t('parms_must_be_json')}
          onChange={(e) => setParms(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="edges"
          label={t('edges')}
          type="text"
          fullWidth
          multiline
          value={edges}
          error={edgesError}
          helperText={edgesError && t('edges_must_be_an_array_of_objects_and_json')}
          onChange={(e) => setEdges(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant='contained'
          startIcon={<CloseIcon />}
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={handleEditStation}
          variant='contained'
          disabled={!stationName || !parms || stationNameError}
          startIcon={<SaveIcon />}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
