// React
import React from "react";

// Design
import Box from '@mui/material/Box';

// Internal
import { getStationList } from '../../../../store/slices/app';
import StationsTable from './stationsTable';


// Third-party
import { useSelector } from 'react-redux';


export default function Stations() {


  const stationsList = useSelector(getStationList);

  return (
    <>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '4px',
          boxShadow: 1,
          width: '100%',
          height: '100%',
        }}
      >

        <StationsTable
          stations={stationsList}
        />
      </Box>
    </>
  )
}