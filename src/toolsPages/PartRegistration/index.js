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

  const [cameraName, setCameraNane] = useState("CENTER");

  const item = imagesList.find(item => item?.camera_name === cameraName);

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
    setCameraNane(item?.camera_name);
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

  const HEIGHT = [1, 1, 1, 2, 2, 2];
  const WIDTH = [1, 2, 3, 3, 3, 3];

  const refImagesList = useRef(imagesList);

  useEffect(() => {
    refImagesList.current = imagesList;
  }, [imagesList]);

  const onClickRegister = useCallback(
    (item) => {
      setDialogTitle(
        item?.frame_time
          ? `${item?.camera_name} - ${item?.frame_time} `
          : `${item?.camera_name} `
      );
      setImagePath(item?.full_url);
      setOpenImageInfoDialog(true);
    },
    [imagesList]
  );

  const appButtons = useMemo(() => {
    return appbarButtonList.map((item, index) => {
      let icon = item.icon;
      let onClick;
      if (item.id === "register") {
        onClick = () => onClickRegister(refImagesList.current[0]);
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
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
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
                      boxShadow: 1,
                      borderRadius: '1rem',
                      padding: '1rem',
                      cursor: 'pointer',
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

                  <Typography textAlign="center">{`${item?.camera_name}`}</Typography>
                </Box>
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
                  onChange={(e, newValue) => handleImageChange(newValue)}
                  options={imagesList}
                  getOptionLabel={(option) => option?.camera_name}
                  defaultValue={imagesList[0].camera_name}
                  renderInput={(params) => <TextField {...params} />}
                />
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
          />
        </Box>
      )}
    </PageWrapper>
  );
}
