// React
import React, {
  useEffect,
  useState,
  Fragment,
  useMemo,
} from "react";

//Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

//Internal
import fetchJson from "../../utils/functions/fetchJson";
import PageWrapper from "../../components/PageWrapper";

// Third-party
import AutoSizer from 'react-virtualized-auto-sizer';
import { useTranslation } from "react-i18next";
import { downloadImage } from "sdk-fe-eyeflow";
import { CardActions } from "@mui/material";
import { FixedSizeList } from "react-window";

const style = {
  mainBox: {
    display: "flex",
    overflow: "hidden",
  },
  imageBox: {
    display: "flex",
    bgcolor: "background.paper",
    flexDirection: "column",
    flexGrow: 1,
    gap: 1,
  },
};

export default function ImagesViewer({ pageOptions }) {

  const { t } = useTranslation();

  const [imagesList, setImagesList] = useState([]);
  const [imageDatesList, setImageDatesList] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingFilesList, setLoadingFilesList] = useState(false);
  const [day, setDay] = useState("");
  const [days, setDays] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [imagePath, setImagePath] = useState("");
  const [imageName, setImageName] = useState("");

  const { itemHeight, menuWidth } = useMemo(() => {
    return {
      itemHeight: 150,
      menuWidth: 310,
    };
  }, []);

  const dirPath = `${pageOptions.options.imagesDirPath}`;

  const onClickImage = (imgPath, imgName, index) => {
    setLoadingImage(true);
    setSelectedImageIndex(index);
    setImagePath(imgPath);
    setImageName(imgName);
    setLoadingImage(false);
  }

  useEffect(() => {
    fetchJson(dirPath)
      .then((res) => {
        let _days = res.filter(item => item.type === "directory").map((item) => {
          return {
            date: item.name,
            formattedDate: item.name.substring(6, 8) + "/" + item.name.substring(4, 6) + "/" + item.name.substring(0, 4),
          };
        });

        _days.reverse();
        setDays(_days);
      })
      .catch((err) => {
        console.log(err);
      }
    );
  }, [dirPath]);

  useEffect(() => {
    if (!day) return;
    setLoadingFilesList(true);
    setSelectedImageIndex(-1);
    setImagePath("");

    const fetchFiles = async () => {
      try {
        const res = await fetchJson(`${dirPath}/${day}/`);
        const filesList = res.filter(item => item.name.includes('.jpg')).map(item => ({
          name: item.name,
          mtime: item.mtime,
        }));

        const imagesList = filesList.map(item => item.name);
        const imageDatesList = filesList.map(item => {
          const mtimeString = item.mtime;

          const date = new Date(mtimeString);
          const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          const formattedTime = date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return `${formattedDate} - ${formattedTime}`;
        });

        setImagesList(imagesList);
        setImageDatesList(imageDatesList);

        setLoadingFilesList(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFiles();
  }, [
    day,
    dirPath,
  ]);

  const itemRenderer = ({ index, style }) => {
    let currentImage = imagesList[index];
    let currentImageDate = imageDatesList[index];

    const customStyle = Object.assign(
      {
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "150px",
        //marginBottom: 5,
        borderRadius: 1,
        // overflow: 'visible',
      },
      style
    );

    return (
      <Grid
        item
        key={index}
        style={customStyle}
        //sx={{gap: 1}}
      >
        <Card
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            //gap: 1,
            bgcolor: index === selectedImageIndex ? "lightblue" : "background.paper",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "200px",
              height: "100px",
              objectFit: "contain",
              cursor: "pointer",
              marginTop: 1,
            }}
            onClick={() => onClickImage(`${dirPath}${day}/${currentImage}`, `${currentImage.replace('.jpg', '')} - ${currentImageDate}`, index)}
            image={`${dirPath}/${day}/${currentImage}`}
            alt={currentImageDate}
          />
          <CardActions
            sx={{
              maxHeight: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              //gap: 1,
            }}
          >
            <Typography textAlign="center" variant="body2" sx={{ marginRight: 1 }}>{`${currentImageDate}`}</Typography>
            <Tooltip title={t("download")}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => downloadImage(`${dirPath}${day}/${currentImage}`, `${currentImage.replace('.jpg', '')}-${currentImageDate.replaceAll(' ', '')}`)}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  return (
    <Fragment>
      <PageWrapper>
        {({ width, height }) => (
          <Box
            width={width}
            height={height}
            sx={style.mainBox}
          >
            <Box
              sx={{
                width: pageOptions.options.eventMenuWidth,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                //minWidth: "15%"
              }}
            >
              <Box id="menu-box" height={height}
                sx={{
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  minWidth: "250px",
                  borderRadius: 1,
                  // overflowY: "auto",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "55px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}>
                  <Autocomplete
                    fullWidth
                    autoComplete
                    label="Date"
                    variant="outlined"
                    color="secondary"
                    sx={{ width: "100%", }}
                    value={day[0]}
                    options={days}
                    defaultValue={days[0]}
                    onChange={(_, newValue) => setDay(newValue?.date)}
                    renderInput={(params) => <TextField {...params} />}
                    getOptionLabel={(option) => option?.formattedDate ?? ""}
                    isOptionEqualToValue={(option, value) => option?.date === value?.date}
                  />
                </Box>
                <Grid
                  id="content"
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {loadingFilesList ?
                    <Grid>
                      <CircularProgress />
                    </Grid>
                    : imagesList.length === 0 && day ? (
                      <Grid>
                        <Typography variant="h6" textAlign="center">{t("empty_list")}</Typography>
                      </Grid>
                    ) : imagesList.length > 0 && !loadingFilesList && (
                      <Box
                        width={menuWidth}
                        sx={{
                          bgcolor: 'background.paper',
                          height: `calc(${height}px - 55px)`,
                          width: '100%',
                          gap: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          p: 1,
                          flexGrow: 1
                        }}
                      >
                        <AutoSizer>
                          {({ height, width }) => (
                            <FixedSizeList
                              height={height}
                              width={width}
                              itemCount={imagesList.length}
                              itemSize={itemHeight}
                            >
                              {itemRenderer}
                            </FixedSizeList>
                          )}
                        </AutoSizer>
                      </Box>
                    )
                  }
                </Grid>
              </Box>
            </Box>
            <Box
              display="flex"
              height={height}
              sx={{
                bgcolor: "background.paper",
                opacity: imagePath ? 1 : 0.8,
                width: "100%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 5,
                borderRadius: 1,
                //width: "90%"
              }}
            >
              {imagesList.length > 0 && !imagePath ? (
                <Box>
                  <Typography variant="h6" textAlign="center">{t("select_an_image_for_download")}</Typography>
                </Box>
              ) : (
                imagePath && (
                  <Fragment>
                    <Card
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {loadingImage ? (
                        <Grid>
                          <CircularProgress />
                        </Grid>
                      ) : (
                        <>
                          <CardMedia
                            component="img"
                            image={`${imagePath}`}
                            sx={{
                              width: "100%",
                              objectFit: "contain",
                              minHeight: "95%",
                            }}
                          />
                          <CardActions
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 5,
                              width: "100%",
                              bgcolor: "background.paper",
                              minHeight: "5%"
                            }}
                          >
                            <Typography textAlign="center">{`${imageName}`}</Typography>
                            <Tooltip title={t("download")}>
                              <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => downloadImage(imagePath, imageName)}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </CardActions>
                        </>
                      )}
                    </Card>
                  </Fragment>
                ))}
            </Box>
          </Box>
        )}
      </PageWrapper>
    </Fragment>
  );
}
