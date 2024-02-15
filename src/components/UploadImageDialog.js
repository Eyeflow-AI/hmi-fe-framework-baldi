import React, { useEffect, useState } from 'react';

// Design
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Button, TextField, Typography } from '@mui/material';

// Internal
import API from '../api';
import { getUser } from '../store/slices/auth';
import fetchJson from '../utils/functions/fetchJson';

// Third-party
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TransformWrapper, TransformComponent } from '@pronestor/react-zoom-pan-pinch';

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

export default function UploadImageDialog({ imagePath, title, open, setOpen, maskMapParmsURL }) {
  const { t } = useTranslation();
  const [noImage, setNoImage] = useState(false);
  const [selectedObj, setSelectedObj] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [datasetList, setDatasetList] = useState([]);
  const user = useSelector(getUser);
  const [base64Str, setBase64Str] = useState('');
  const [errorInText, setErrorInText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [parms, setParms] = useState([]);
  let urlParms = maskMapParmsURL;

  const handleUpload = () => {
    setLoading(true);

    API.post.uploadImageInfo({
      data: {
        dataset_id: dataset.dataset_id,
        ...Object.keys(dataset).filter((part) => part !== 'dataset_id').reduce((obj, key) => {
          obj[key] = dataset[key];
          return obj;
        }, {}),
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


  useEffect(() => {
    fetchJson(urlParms)
      .then((res) => {
        setParms(res?.parts_fields);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getDocument = (selectedParam) => {
    API.get
      .appParameterDocument({ parameterName: selectedParam })
      .then((res) => {
        setDatasetList(res.document.pages["Images Capturer"].options.datasetChoices)
        // console.log(res)
      })
      .finally(() => { });
  };

  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);


  useEffect(() => {
    let errInText = {};
    if ([null, ''].includes(dataset?.dataset_id ?? null)) {
      errInText.dataset_id = true;
    }
    else {
      errInText.dataset_id = false;
    }

    if (dataset) {
      Object.keys(dataset).forEach((part) => {
        if (part === 'part_id' && isNaN(dataset[part]) || dataset[part] <= 0) {
          errInText[part] = true;
        } else if (part !== 'part_id' && [null, ''].includes(dataset[part])) {
          errInText[part] = true;
        }
        if (!dataset?.dataset_id?.maskMap && [null, ''].includes(dataset[part])) {
          errInText[part] = false
        }
      })
    }

    setErrorInText(errInText)
    setDisabled(Object.values(errInText).includes(true))
  }, [dataset]);

  const handleUpdate = (key, value) => {
    setDataset((preValue) => ({ ...preValue, [key]: value }))
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
      <Box
        sx={{
          margin: '1vw 0 1vw 0',
        }}
      >
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
                    helperText={errorInText?.dataset_id ?? false ? 'Campo obrigatório.' : ''}
                  />
                  {parms?.map((part, index) => (
                    <TextField
                      key={index}
                      id={part.id}
                      variant="outlined"
                      color="secondary"
                      sx={{
                        width: '60%',
                        height: 'auto',
                      }}
                      value={dataset?.[part.id]}
                      required={dataset?.dataset_id?.maskMap ? true : false}
                      onChange={(e) => handleUpdate(part.id, e.target.value)}
                      label={part.label}
                      error={errorInText?.[part.id] ?? false}
                      helperText={errorInText?.[part.id] ?? false ? 'Campo obrigatório.' : ''}
                    />
                  ))}

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
