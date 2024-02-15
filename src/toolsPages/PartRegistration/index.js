// React
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";

// Design
import { Box, Typography, Card, CardMedia, Autocomplete, TextField } from "@mui/material";

// Internal
import PageWrapper from "../../components/PageWrapper";
import UploadImageDialog from "../../components/UploadImageDialog";
import ImageDialog from "../../components/ImageDialog";
import GetImagesList from "../utils/Hooks/GetImagesList";
import GetEdgeEnvVar from "../../utils/Hooks/GetEdgeEnvVar";

// Third-party

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    // bgcolor: 'red',
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  }),
};

export default function PartRegistration({ pageOptions }) {
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openImageInfoDialog, setOpenImageInfoDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [imagePath, setImagePath] = useState("");
  const { imageBaseURL, infoURL, envVarURL, appbarButtonList } = useMemo(() => {
    return {
      imageBaseURL: pageOptions?.options?.imageURL ?? "",
      infoURL: pageOptions?.options?.infoURL ?? "",
      envVarURL: pageOptions?.options?.envVarURL ?? "",
      appbarButtonList: pageOptions?.options?.appbarButtonList ?? [],
    };
  }, [pageOptions]);
  const { clock, imagesList } = GetImagesList({
    url: infoURL,
    imageBaseURL,
    sleepTime: pageOptions?.options?.sleepTime,
  });
  const { envVar, updateData: updateEnvVarData } = GetEdgeEnvVar({
    url: envVarURL,
    sleepTime: pageOptions?.options?.sleepTime,
  });

  const [cameraName, setCameraName] = useState(imagesList[0]?.camera_name);

  const [item, setItem] = useState(imagesList[0]);

  const onOpenDialog = useCallback((item) => {
    return () => {
      setOpenImageDialog(true);
      setDialogTitle(
        item?.frame_time
          ? `${item?.camera_name} - ${item?.frame_time}`
          : `${item?.camera_name}`
      );
      setImagePath(item?.full_url);
    };
  }, []);

  const handleImageChange = (item) => {
    if (!item) return;
    setItem(item);
    setCameraName(item?.camera_name);
    setImagePath(item?.full_url);
    setDialogTitle(
      item?.frame_time
        ? `${item?.camera_name} - ${item?.frame_time}`
        : `${item?.camera_name}`
    );
  };

  useEffect(() => {
    if (!openImageDialog && !openImageInfoDialog) {
      setDialogTitle("");
      setImagePath("");
    }
  }, [openImageDialog, openImageInfoDialog]);

  const refImagesList = useRef(imagesList);

  useEffect(() => {
    refImagesList.current = imagesList;
    setCameraName(imagesList[0]?.camera_name);
    setItem(imagesList[0]);
    setImagePath(imagesList[0]?.full_url);
    setDialogTitle(
      imagesList[0]?.frame_time
        ? `${imagesList[0]?.camera_name} - ${imagesList[0]?.frame_time}`
        : `${imagesList[0]?.camera_name}`
    );
  }, [imagesList]);


  const appButtons = useMemo(() => {
    return appbarButtonList.map((item, index) => {
      let icon = item.icon;
      let onClick;
      if (item.id === "register") {
        onClick = () => setOpenImageInfoDialog(true);
      } else {
        onClick = () => console.log(`${item.label} not implemented yet!`);
      }
      return {
        ...item,
        icon,
        onClick,
      };
    });
  }, [appbarButtonList]);

  return (
    <PageWrapper extraButtons={appButtons}>
      {({ width, height }) => (
        <Box width={width} height={height} sx={style.mainBox}>
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
            <Box
              sx={{
                display: "grid",
                gridTemplateRows: "1fr 20px 80px",
                gap: 1,
                width: "100%",
                height: "100%",
                padding: "1rem",
                overflow: "auto",
                justifyItems: "center",
              }}
            >
              <Card
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
                onClick={onOpenDialog(item)}
              >
                <CardMedia
                  component="img"
                  image={`${item?.full_url}?time=${clock}`}
                  style={{
                    objectFit: 'contain',
                    minWidth: '2560px * 0.3',
                    minHeigth: '1440px * 0.3',
                    display: 'block',
                    margin: 'auto',
                    paddingBottom: '.5rem',
                  }}
                />
              </Card>

              <Typography textAlign="center">{`${cameraName}`}</Typography>
              <Autocomplete
                autoComplete
                label="Camera"
                variant="outlined"
                color="secondary"
                sx={{
                  width: '60%',
                  height: 'auto',
                }}
                value={item}
                onChange={(_, newValue) => handleImageChange(newValue)}
                options={imagesList}
                getOptionLabel={(option) => option?.camera_name}
                defaultValue={imagesList[0]}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>

          </Box>
          <ImageDialog
            open={openImageDialog}
            setOpen={setOpenImageDialog}
            imagePath={imagePath}
            title={dialogTitle}
          />
          <UploadImageDialog
            open={openImageInfoDialog}
            setOpen={setOpenImageInfoDialog}
            imagePath={imagePath}
            title={dialogTitle}
            maskMapParmsURL={pageOptions?.options?.maskMapParmsURL}
          />
        </Box>
      )}
    </PageWrapper>
  );
}
