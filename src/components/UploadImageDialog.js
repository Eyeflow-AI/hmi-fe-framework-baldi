import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Button, TextField, Typography } from "@mui/material";

// Internal
import API from "../api";
import { getUser } from "../store/slices/auth";
import fetchJson from "../utils/functions/fetchJson";

// Third-party
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  TransformWrapper,
  TransformComponent,
} from "@pronestor/react-zoom-pan-pinch";

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
  // imagePath,
  base64Str,
  imgWidth,
  imgHeight,
  title,
  open,
  setOpen,
  maskMapParmsURL,
}) {
  const { t } = useTranslation();
  const [noImage, setNoImage] = useState(false);
  const [selectedObj, setSelectedObj] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [datasetList, setDatasetList] = useState([]);
  const user = useSelector(getUser);
  const [errorInText, setErrorInText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  console.log({ base64Str });

  const [parms, setParms] = useState([]);
  let urlParms = maskMapParmsURL;

  const handleUpload = () => {
    setLoading(true);

    API.post
      .uploadImageInfo({
        data: {
          dataset_id: dataset?.dataset_id,
          img_height: imgHeight,
          img_width: imgWidth,
          date: new Date(),
          user_name: user.tokenPayload.payload.username ?? "",
          annotations: {
            part_data: {
              ...Object.keys(dataset)
                .filter((part) => part !== "dataset_id" && part !== "maskMap")
                .reduce((obj, key) => {
                  obj[key] = dataset[key];
                  return obj;
                }, {}),
            },
          },
        },
        imageBase64: base64Str,
        maskMap: dataset?.maskMap,
      })
      .then(() => {
        setLoading(false);
        setDataset(null);
        handleClose();
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchJson(urlParms)
      .then((res) => {
        setParms(res?.parts_fields);
        console.log(res?.parts_fields);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [urlParms]);

  const getDocument = (selectedParam) => {
    API.get
      .appParameterDocument({ parameterName: selectedParam })
      .then((res) => {
        setDatasetList(
          res.document.pages["Images Capturer"].options.datasetChoices
        );
      })
      .finally(() => {});
  };

  useEffect(() => {
    getDocument("feConfig");
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

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
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
          margin: "1vw 0 1vw 0",
        }}
      >
        {!noImage ? (
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
                  <TransformComponent>
                    <img
                      src={base64Str}
                      alt={""}
                      onLoad={() => resetTransform()}
                      style={{
                        objectFit: "contain",
                        width: "65%",
                        height: "auto",
                        margin: "auto",
                      }}
                    />
                  </TransformComponent>

                  <Autocomplete
                    id="dataset_id_autocomplete"
                    autoComplete
                    variant="outlined"
                    color="secondary"
                    sx={{
                      width: "60%",
                      height: "auto",
                    }}
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

                  {parms?.map((part, index) => (
                    <TextField
                      key={index}
                      id={part.id}
                      variant="outlined"
                      color="secondary"
                      sx={{
                        width: "60%",
                        height: "auto",
                      }}
                      value={dataset?.[part.id]}
                      required={dataset?.maskMap}
                      onChange={(e) => handleUpdate(part.id, e.target.value)}
                      label={part.label}
                      error={errorInText?.[part.id] ?? false}
                      helperText={
                        errorInText?.[part.id] ?? false
                          ? "Campo obrigatório."
                          : ""
                      }
                    />
                  ))}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    sx={{
                      //width: '20rem',
                      width: "20%",
                      height: "auto",
                      margin: "auto",
                    }}
                    disabled={disabled || loading}
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
              display: "flex",
              width: "100%",
              height: "calc(100vh - 80px)",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "100px",
            }}
          >
            No image
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
