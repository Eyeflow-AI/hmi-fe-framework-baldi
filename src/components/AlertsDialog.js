// React
import React, { } from "react";

// Design
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

// Internal


// Third-party
import { useTranslation } from "react-i18next";

const appBarSx = {
  width: '100%',
  height: 64,
  bgcolor: 'primary.main',
  color: 'white',
  boxShadow: 1
};


export default function ImageDialog() {

  const { t } = useTranslation();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      sx={{
        // zIndex: 99999999999999
      }}
    >
      <Box sx={appBarSx}>
      </Box>

    </Dialog>
  );
};