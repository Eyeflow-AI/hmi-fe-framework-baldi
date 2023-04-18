import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';


const style = {
  mainBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    color: 'white',
    boxShadow: 24,
    p: 4,
  }
}

const modalProps = {
  slots: { backdrop: Backdrop },
  slotProps: {
    backdrop: {
      timeout: 500,
    },
  }
}

// TODO
export default function TransitionsModal({open, handleClose}) {

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={modalProps.slots}
      slotProps={modalProps.slotProps}
    >
      <Fade in={open}>
        <Box sx={style.mainBox}>
          <Button color="inherit" variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button variant="contained">Send</Button>
        </Box>
      </Fade>
    </Modal>
  );
}
