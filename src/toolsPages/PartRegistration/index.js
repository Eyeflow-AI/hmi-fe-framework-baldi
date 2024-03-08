// React
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";

// Design
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";

// Internal
import PageWrapper from "../../components/PageWrapper";
import UploadImageDialog from "../../components/UploadImageDialog";
import ImageDialog from "../../components/ImageDialog";
import GetImagesList from "../utils/Hooks/GetImagesList";

// Third-party

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
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
  const { imageBaseURL, infoURL, appbarButtonList } = useMemo(() => {
    return {
      imageBaseURL: pageOptions?.options?.imageURL ?? "",
      infoURL: pageOptions?.options?.infoURL ?? "",
      appbarButtonList: pageOptions?.options?.appbarButtonList ?? [],
    };
  }, [pageOptions]);

  const { clock, imagesList } = GetImagesList({
    url: infoURL,
    imageBaseURL,
    sleepTime: pageOptions?.options?.sleepTime,
  });

  const [cameraName, setCameraName] = useState(imagesList[0]?.camera_name);

  const [item, setItem] = useState({});
  const [base64Str, setBase64Str] = useState("");
  const [base64StrToUpload, setBase64StrToUpload] = useState("");
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const refImagesList = useRef(imagesList);

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
    setDialogTitle(
      item?.frame_time
        ? `${item?.camera_name} - ${item?.frame_time}`
        : `${item?.camera_name}`
    );
  };

  const URLtoBase64 = (url) => {
    let img = new Image();
    img.src = url;
    img.crossOrigin = "Anonymous";

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      setBase64Str(dataUrl);
      setImgWidth(img.width);
      setImgHeight(img.height);
    };
  };

  useEffect(() => {
    if (imagePath) {
      URLtoBase64(imagePath);
    }
  }, [imagePath]);

  useEffect(() => {
    if (!openImageDialog && !openImageInfoDialog) {
      setDialogTitle("");
      setImagePath("");
      setBase64StrToUpload("");
    }

    if (openImageInfoDialog) {
      setBase64StrToUpload(base64Str);
      setDialogTitle(
        item?.frame_time
          ? `${item?.camera_name} - ${item?.frame_time}`
          : `${item?.camera_name}`
      );
    }
  }, [openImageDialog, openImageInfoDialog]);

  useEffect(() => {
    setImagePath(`${item?.full_url}?time=${clock}`);
  }, [item, clock]);

  useEffect(() => {
    let _imagesList = imagesList.map((item) => {
      return {
        camera_name: item.camera_name,
        full_url: item.full_url,
        height: item.height,
        width: item.width,
        url_path: item.url_path,
      };
    });
    if (JSON.stringify(_imagesList) !== JSON.stringify(refImagesList.current)) {
      refImagesList.current = _imagesList;
      setCameraName(imagesList[0]?.camera_name);
      setItem(imagesList[0]);
      setDialogTitle(
        imagesList[0]?.frame_time
          ? `${imagesList[0]?.camera_name} - ${imagesList[0]?.frame_time}`
          : `${imagesList[0]?.camera_name}`
      );
    }
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
                  image={base64Str}
                  style={{
                    objectFit: "contain",
                    minWidth: "2560px * 0.3",
                    minHeigth: "1440px * 0.3",
                    display: "block",
                    margin: "auto",
                    paddingBottom: ".5rem",
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
                  width: "60%",
                  height: "auto",
                }}
                value={item}
                onChange={(_, newValue) => handleImageChange(newValue)}
                options={imagesList}
                getOptionLabel={(option) => option?.camera_name ?? ""}
                defaultValue={imagesList?.[0] ?? {}}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          </Box>
          <ImageDialog
            open={openImageDialog}
            setOpen={setOpenImageDialog}
            imagePath={base64Str}
            title={dialogTitle}
          />
          <UploadImageDialog
            open={openImageInfoDialog}
            setOpen={setOpenImageInfoDialog}
            base64Str={base64StrToUpload}
            imgWidth={imgWidth}
            imgHeight={imgHeight}
            title={dialogTitle}
            maskMapParmsURL={pageOptions?.options?.maskMapParmsURL}
            datasets={pageOptions?.options?.datasetChoices}
          />
        </Box>
      )}
    </PageWrapper>
  );
}
