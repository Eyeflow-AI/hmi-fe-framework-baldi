import React, { Fragment, useEffect, useRef, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import { Button } from "@mui/material";

// Internal
import API from "../api";
import { getUser } from "../store/slices/auth";
import fetchJson from "../utils/functions/fetchJson";
import { setNotificationBar } from "../store/slices/app";

// Third-party
import {
  TransformWrapper,
  TransformComponent,
} from "@pronestor/react-zoom-pan-pinch";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const gridToolbarSx = {
  width: "100%",
  justifyContent: "space-between",
  alignItems: "center",
};

const appBarSx = {
  width: "100%",
  height: 200,
  bgcolor: "primary.main",
  color: "white",
  boxShadow: 1,
};

export default function UploadImageDialog({
  base64Str,
  imgWidth,
  imgHeight,
  title,
  open,
  setOpen,
  maskMapParmsURL,
  datasets,
}) {
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [dataset, setDataset] = useState(null);
  const [noImage, setNoImage] = useState(false);
  const [datasetList, setDatasetList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [errorInText, setErrorInText] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [parms, setParms] = useState([]);
  const [croppedBase64Str, setCroppedBase64Str] = useState(null);
  const [croppedWidth, setCroppedWidth] = useState(0);
  const [croppedHeight, setCroppedHeight] = useState(0);
  const [cropInfo, setCropInfo] = useState(null);
  const [_base64Str, _setBase64Str] = useState(null);

  let urlParms = maskMapParmsURL;

  const cropperRef = useRef(null);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    setCropInfo(cropper);
  };

  const handleSaveCrop = () => {
    setCroppedBase64Str(cropInfo.getCroppedCanvas().toDataURL());
    setCroppedWidth(cropInfo.getCroppedCanvas().width);
    setCroppedHeight(cropInfo.getCroppedCanvas().height);
    setCropping(false);
    dispatch(
      setNotificationBar({
        show: true,
        type: "success",
        message: "image_crop_sucessful",
      })
    );
  };

  const handleUpload = () => {
    setLoading(true);

    API.post
      .uploadImageInfo({
        data: {
          dataset_id: dataset?.dataset_id,
          img_height: croppedHeight !== 0 ? croppedHeight : imgHeight,
          img_width: croppedWidth !== 0 ? croppedWidth : imgWidth,
          date: new Date(),
          user_name: user.tokenPayload.payload.username ?? "",
          annotations: {
            part_data: {
              signalize: true,
              ...Object.keys(dataset)
                .filter((part) => part !== "dataset_id" && part !== "maskMap")
                .reduce((obj, key) => {
                  obj[key] = dataset[key];
                  return obj;
                }, {}),
            },
          },
        },
        imageBase64: croppedBase64Str ?? _base64Str,
        maskMap: dataset?.maskMap,
      })
      .then(() => {
        dispatch(
          setNotificationBar({
            show: true,
            type: "success",
            message: "upload_sucessful",
          })
        );
        setLoading(false);
        setDataset(null);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJson(urlParms)
      .then((res) => {
        let _parms = res?.parts_fields.filter((part) => part.show);
        setParms(_parms);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [urlParms]);

  useEffect(() => {
    if (!base64Str) return;
    _setBase64Str(base64Str);
  }, [base64Str]);

  useEffect(() => {
    if (!open) {
      setDataset(null);
      setCroppedWidth(0);
      setCroppedHeight(0);
      setCroppedBase64Str(null);
      setCropping(false);
      _setBase64Str(null);
      setNoImage(false);
    }
  }, [open]);

  useEffect(() => {
    setDatasetList(datasets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let errInText = {};
    if ([null, "", undefined].includes(dataset?.dataset_id)) {
      errInText.dataset_id = true;
    } else {
      errInText.dataset_id = false;
    }

    parms?.forEach((part) => {
      if (dataset && dataset[part.id] <= 0) {
        errInText[part.id] = true;
      } else {
        errInText[part.id] = false;
      }
      if (dataset?.maskMap) {
        if (
          [null, "", undefined].includes(dataset?.[part.id] ?? null) ||
          (dataset && dataset[part.id] <= 0)
        ) {
          errInText[part.id] = true;
        } else {
          errInText[part.id] = false;
        }
      }
    });

    setErrorInText(errInText);
    setDisabled(Object.values(errInText).includes(true));
  }, [dataset, parms]);

  const handleUpdate = (key, value) => {
    if (key === "dataset_id") {
      setDataset((preValue) => ({
        ...preValue,
        [key]: value?.dataset_id,
        maskMap:
          datasetList.find((el) => el?.dataset_id === value?.dataset_id)
            ?.maskMap ?? false,
      }));
    } else {
      setDataset((preValue) => ({ ...preValue, [key]: value }));
    }
  };

  const handleResetCrop = () => {
    setCroppedBase64Str(null);
    setCroppedWidth(0);
    setCroppedHeight(0);
    setCropping(false);
    dispatch(
      setNotificationBar({
        show: true,
        type: "success",
        message: "original_image_restored",
      })
    );
  };

  return (
    <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
      <Box sx={appBarSx}>
        <Toolbar style={{ textShadow: "1px 1px #00000080" }}>
          <Grid container sx={gridToolbarSx}>
            <Grid xs={10} item>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="flex-start"
                width="100%"
                gap={3}
              >
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  {title}
                </Typography>
              </Box>
            </Grid>
            <Grid xs={2} item>
              <Box display="flex" justifyContent="flex-end">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Box>
      <Box
        sx={{
          margin: "1vw 0 1vw 0",
        }}
      >
        {_base64Str || (croppedBase64Str && !noImage) ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "calc(100vh - 80px)",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "nowrap",
              flexDirection: "column",
            }}
          >
            <TransformWrapper wheel={{ step: 0.2 }} limitToBounds={true}>
              {({ resetTransform }) => (
                <Box
                  sx={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "1rem",
                    margin: "1rem",
                  }}
                >
                  {!cropping ? (
                    <Fragment>
                      <TransformComponent>
                        <img
                          src={croppedBase64Str ?? _base64Str}
                          alt={""}
                          onLoad={() => resetTransform()}
                          style={{
                            objectFit: "contain",
                            width: 800,
                            height: 600,
                            margin: "auto",
                          }}
                        />
                      </TransformComponent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setCropping(true)}
                        >
                          {t("crop_image")}
                        </Button>
                        {croppedBase64Str && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleResetCrop()}
                          >
                            {t("reset_crop_image")}
                          </Button>
                        )}
                      </Box>
                    </Fragment>
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                        overflow: "hidden",
                      }}
                    >
                      <Cropper
                        guides={false}
                        crop={onCrop}
                        src={_base64Str}
                        ref={cropperRef}
                        initialAspectRatio={16 / 9}
                        style={{
                          width: 800,
                          height: 600,
                          objectFit: "contain",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                        onWheel={(e) => e.preventDefault()}
                        zoomOnTouch={false}
                        zoomOnWheel={false}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setCropping(false);
                          setCroppedBase64Str(null);
                        }}
                        sx={{
                          mt: "2rem",
                        }}
                      >
                        {t("cancel_cropping")}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveCrop()}
                        sx={{
                          mt: "2rem",
                        }}
                      >
                        {t("saved_cropped_image")}
                      </Button>
                    </Box>
                  )}
                  {!cropping && (
                    <Fragment>
                      <Grid
                        container
                        spacing={1}
                        sx={{
                          maxWidth: "50%",
                          marginBlock: 1,
                        }}
                      >
                        <Grid item xs={6}>
                          <Autocomplete
                            fullWidth
                            id="dataset_id_autocomplete"
                            autoComplete
                            variant="outlined"
                            color="secondary"
                            value={
                              datasetList.find(
                                (el) => el?.dataset_id === dataset?.dataset_id
                              ) ?? null
                            }
                            required
                            onChange={(e, newValue) =>
                              handleUpdate("dataset_id", newValue)
                            }
                            options={datasetList}
                            getOptionLabel={(option) => option.label ?? option}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Dataset"
                                error={errorInText?.dataset_id ?? false}
                                helperText={
                                  errorInText?.dataset_id ?? false
                                    ? "Campo obrigatório."
                                    : ""
                                }
                              />
                            )}
                          />
                        </Grid>
                        {parms?.length > 0 &&
                          parms?.map((part, index) => (
                            <Grid
                              item
                              xs={
                                parms.length % 2 === 0 &&
                                index === parms.length - 1
                                  ? 12
                                  : 6
                              }
                            >
                              <TextField
                                fullWidth
                                key={index}
                                id={part.id}
                                variant="outlined"
                                color="secondary"
                                value={dataset?.[part.id]}
                                required={true}
                                onChange={(e) =>
                                  handleUpdate(part.id, e.target.value)
                                }
                                label={part.label}
                                error={errorInText?.[part.id] ?? false}
                                helperText={
                                  errorInText?.[part.id] ?? false
                                    ? "Campo obrigatório."
                                    : ""
                                }
                              />
                            </Grid>
                          ))}
                      </Grid>

                      <LoadingButton
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        sx={{
                          width: "20%",
                          height: "auto",
                        }}
                        disabled={disabled || loading}
                        loading={loading}
                      >
                        {t("upload_image")}
                      </LoadingButton>
                    </Fragment>
                  )}
                </Box>
              )}
            </TransformWrapper>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "calc(100vh - 80px)",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "100px",
            }}
          >
            <Typography
              sx={{
                display: "block",
                margin: "auto",
              }}
            >
              {t("no_image_error")}
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
