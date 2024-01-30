// React
import React, { useEffect, useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import DownloadIcon from '@mui/icons-material/Download';
import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { getUser } from '../store/slices/auth';

// Internal
import API from '../api';

// Third-party
import { TransformWrapper, TransformComponent } from '@pronestor/react-zoom-pan-pinch';
import { downloadImage, colors, getAnnotatedImage } from 'sdk-fe-eyeflow';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const gridToolbarSx = {
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const appBarSx = {
  width: '100%',
  height: 200,
  bgcolor: 'primary.main',
  color: 'white',
  boxShadow: 1,
};

export default function ImageDialog({ imagePath, title, open, setOpen }) {
  const { t } = useTranslation();
  const [noImage, setNoImage] = useState(false);
  const [selectedObj, setSelectedObj] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [datasetList, setDatasetList] = useState(
    []
  );
  const user = useSelector(getUser);
  const [base64Str, setBase64Str] = useState('');
  const [errorInText, setErrorInText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleUpload = () => {
    setLoading(true);

    API.post.uploadImageInfo({
      data: {
        ...dataset.dataset_id,
        img_height: imgHeight,
        img_width: imgWidth,
        date: new Date(),
        user_name: user.tokenPayload.payload.username ?? '',
      },
      imageBase64: base64Str,
    })
    .then((res) => {
      setLoading(false);
      setDataset(null);
      handleClose();
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setNoImage(false);
      if (selectedObj?.originalUrl !== imagePath) {
        URL.revokeObjectURL(selectedObj?.url);
      }
    } else {
      setSelectedObj({
        url: imagePath,
        originalUrl: imagePath,
      });
    }
  }, [open]);

  const getDocument = (selectedParam) => {
    API.get
      .appParameterDocument({ parameterName: selectedParam })
      .then((res) => {
        setDatasetList(res.document.pages["Images Capturer"].options.datasetChoices)
        console.log(res)
      })
      .finally(() => { });
  };

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);


  useEffect(() => {
    let errInText  = {};
    if ([null, ''].includes(dataset?.dataset_id ?? null)) {
      errInText.dataset_id = true;
    }
    else {
      errInText.dataset_id = false;
    }

    if ([null, ''].includes(dataset?.part_number ?? null) ||
    dataset?.part_number < 0) {
      errInText.part_number = true;
    }
    else {
      errInText.part_number = false;
    }

    if ([null, ''].includes(dataset?.box_quant ?? null) ||
    dataset?.box_quant < 0) {
      errInText.box_quant = true;
    } else {
      errInText.box_quant = false;
    }

    setErrorInText(errInText)

    if (![null, ''].includes(dataset?.dataset_id ?? null) &&
      ![null, ''].includes(dataset?.part_number ?? null) &&
      ![null, ''].includes(dataset?.box_quant ?? null) &&
      dataset.part_number >= 0 &&
      dataset.box_quant >= 0
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [dataset]);

  const handleUpdate = (key, value) => {
    setDataset((preValue)=>({...preValue, [key]:value}))
  };

  useEffect(() => {
    getDocument('feConfig');
    let img = new Image();
    img.src = imagePath;
    img.crossOrigin = 'Anonymous';

    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL('image/png')
      setBase64Str(dataUrl)
      setImgWidth(img.width);
      setImgHeight(img.height);
    };
  }, [imagePath]);

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <Box sx={appBarSx}>
        <Toolbar style={{ textShadow: '1px 1px #00000080' }}>
          <Grid container sx={gridToolbarSx}>
            <Grid xs={10} item>
              <Box display="flex" justifyContent="flex-start" alignItems="flex-start" width="100%" gap={3}>
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {title}
                </Typography>
              </Box>
            </Grid>
            <Grid xs={2} item>
              <Box display="flex" justifyContent="flex-end">
                <IconButton edge="start" color="inherit" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Box>
      <Box>
        {!noImage ? (
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: 'calc(100vh - 80px)',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'nowrap',
              flexDirection: 'column',
            }}
          >
            <TransformWrapper wheel={{ step: 0.2 }} limitToBounds={true}>
              {({ resetTransform }) => (
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '1rem',
                    margin: '1rem',
                  }}
                >
                  <TransformComponent>
                    <img
                      src={selectedObj?.url}
                      alt={''}
                      onLoad={() => resetTransform()}
                      style={{
                        objectFit: 'contain',
                        //maxWidth: "calc(2560px * 0.3)",
                        //maxHeight: "calc(1440px * 0.3)",
                        width: '65%',
                        height: 'auto',
                        margin: 'auto',
                      }}
                    />
                  </TransformComponent>

                  <Autocomplete
                    id='dataset_id_autocomplete'
                    autoComplete
                    variant="outlined"
                    color="secondary"
                    sx={{
                      //width: '60rem',
                      //maxHeight: '5.5vw',
                      //maxWidth: '100%',
                      width: '60%',
                      height: 'auto',
                    }}
                    value={dataset?.dataset_id}
                    required
                    onChange={(e, newValue) => handleUpdate('dataset_id', newValue)}
                    options={datasetList}
                    getOptionLabel={(option) => option.label ?? option}
                    renderInput={(params) => <TextField {...params} label="Dataset *" />}
                    error={errorInText?.dataset_id ?? false}
                    helperText={errorInText?.dataset_id ?? false?'Campo obrigatório.':''}
                  />

                  <TextField
                    id='part_number_text_field'
                    label="Part Number"
                    variant="outlined"
                    color="secondary"
                    sx={{
                      //width: '60rem',
                      width: '60%',
                      height: 'auto',
                    }}
                    value={dataset?.part_number}
                    type="number"
                    min="0"
                    required
                    onChange={(e) => handleUpdate('part_number', e.target.value.toString())}
                    error={errorInText?.part_number ?? false}
                    helperText={errorInText?.part_number ?? false?'Campo obrigatório - valor não pode ser negativo.':''}
                  />

                  <TextField
                    id='box_quant_text_field'
                    label="Box Quantity"
                    variant="outlined"
                    color="secondary"
                    sx={{
                      //width: '60rem',
                      width: '60%',
                      maxHeight: 'auto',
                    }}
                    value={dataset?.box_quant}
                    type="number"
                    min="0"
                    required
                    onChange={(e) => handleUpdate('box_quant', e.target.value.toString())}
                    error={errorInText?.box_quant ?? false}
                    helperText={errorInText?.box_quant ?? false?'Campo obrigatório - valor não pode ser negativo.':''}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    sx={{
                      //width: '20rem',
                      width: '20%',
                      height: 'auto',
                      margin: 'auto',
                    }}
                    disabled={disabled}
                  >
                    Save image info
                  </Button>
                </Box>
              )}
            </TransformWrapper>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: 'calc(100vh - 80px)',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '100px',
            }}
          >
            No image
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
