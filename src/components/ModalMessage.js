// React
import React from 'react'

// Design
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';


const styleSx = {
  modalBox : {
    bgcolor: 'background.paper',
    opacity: '93%',
    borderRadius: '8px'
  }
};

function Title(props) {
    return (
      <Typography 
        variant="h5" 
      >
        {props.children}
      </Typography>
    );
};

function Description(props) {
    return (
      <Typography 
        variant="body1" 
        gutterBottom
      >
        {props.children}
      </Typography>
    );
};

export default function ModalMessage( { title, description, modalOpen, setModalOpen, width} ) {

    return(
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <Box
            display="flex"
            flexDirection='column'
            justifyContent="center"
            alignItems="center"
            style={{
                width: '100vw',
                height: '100vh'
            }}
          >
            <Box
              display="flex"
              flexDirection='column'
              justifyContent="center" 
              alignItems="center" 
              sx={styleSx.modalBox} 
              style={{
                  width: (width) ? width : 'auto'
              }}
            >
              <Box marginTop={2}>
                  {title && <Title>{title}</Title>}
              </Box>
              <Box marginBottom={2}>
                  {description && <Description>{description}</Description>}
              </Box>
              <Divider style={{width: '100%', paddingTop: 1}}/>
              <Box style={{width: '100%'}}>
                <Button
                  onClick={(event) => setModalOpen(false)}
                  fullWidth
                  /* variant="outlined" */
                >
                  OK
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    )
};