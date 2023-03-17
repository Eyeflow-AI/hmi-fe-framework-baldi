// React
import React, {useMemo, useState} from 'react';


import Box from '@mui/material/Box';


export default function EventHeader({data, config}) {

  useMemo(() => {
    console.log({data, config})
  }, [data, config]);

  return (
    <Box>
       {JSON.stringify(data)}  
    </Box>
  );
};