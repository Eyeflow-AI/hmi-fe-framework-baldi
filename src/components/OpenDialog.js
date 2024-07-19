import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogTitle, MenuItem, Menu, Paper, Box } from '@mui/material';
import { getDialogInfo, setDialog } from '../store/slices/app';
import { ImageColorPicker } from 'react-image-color-picker';

export default function CompDialog({
  fnName,
  fnExecutor,
  item,
  componentsInfo,
  stationId,
  handleNotificationBar,
  setLoading = null,
}) {
  if (setLoading) setLoading(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const info = useSelector(getDialogInfo);
  const { show, title } = info;

  console.log({ show })

  // useEffect(() => {
  //   // if (show) {
  //   //   setTimeout(() => {
  //   dispatch(setDialog(false));
  //   //   }, 5000)
  //   // }
  //   // eslint-disable-next-line
  // }, [show])

  // on page leave or component unmount or refresh set dialog to false

  const imageUrl = 'http://localhost:6031/data/images/__carro.png';
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      dispatch(
        setDialog({
          show: false,
          title: 'dri'
        })
      );
    })

    return () => {
      dispatch(
        setDialog({
          show: false,
          title: 'dri'
        })
      );
    }
  }, [])

  const openMenuFunc = (e) => {
    setAnchorEl(e.currentTarget);
  }
  const handleClickItem = () => {
    setAnchorEl(false)
  }

  const handleClose = () => {
    dispatch(
      setDialog({
        show: false,
        title: 'dri'
      })
    );
  }


  const handleColorPick = (color) => {
    console.log({ color })
  }



  const ImageGrid = ({ imageSrc }) => {
    const imgRef = useRef(null);
  
    const handleClick = (e) => {
      if (imgRef.current) {
        // Obtém as coordenadas da `div` clicada
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
  
        // Obtém a imagem e cria um canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;
        img.crossOrigin = 'Anonymous';
  
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Desenha a imagem no canvas
        ctx.drawImage(img, 0, 0);
  
        // Obtém a cor do pixel clicado
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  
        console.log(`Cor clicada: ${color}`);
      }
    };
  
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          ref={imgRef}
          src={imageSrc}
          alt="background"
          style={{ width: '400px', height: '400px', position: 'absolute', top: 0, left: 0 }}
        />
        <div
          style={{
            width: '400px',
            height: '400px',
            display: 'grid',
            gridTemplateColumns: 'repeat(20, 1fr)',
            gridTemplateRows: 'repeat(20, 1fr)',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onClick={handleClick}
        >
          {[...Array(400)].map((_, index) => (
            <div
              key={index}
              style={{
                border: '1px solid transparent',
                backgroundColor: 'transparent',
              }}
            />
          ))}
        </div>
      </div>
    );
  };
  
  



  return (
    <Dialog
      open={show}
      onClose={handleClose}
      fullWidth
      fullScreen
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <Paper
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginInline: 2,
          height: "90vh",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            objectFit: "contain",
            content: '""',
            height: "80vh",
            width: "100%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            display: "grid",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "80vw",
            gridTemplateRows: `repeat(${20}, 1fr)`,
            gridTemplateColumns: `repeat(${20}, 1fr)`,
            backgroundImage: `url(${imageUrl})`
          }}>
          {Array.from({ length: 400 }).map((_, index) => {
            return (
              <Box key={index + 1} sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid black",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold",
                height: "100%",
                width: "100%",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.5)"
                }
              }}
                onClick={(e) => openMenuFunc(e)}
              >

              </Box>
            )
          })}

        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(openMenu)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleClickItem()}>Pico</MenuItem>
          <MenuItem onClick={() => handleClickItem()}>Amassado</MenuItem>
          <MenuItem onClick={() => handleClickItem()}>Material</MenuItem>
        </Menu>
      </Paper>
      <DialogActions>
        <Button sx={{
          width: "10%",
          marginTop: 2,
        }} variant="contained"
          onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
