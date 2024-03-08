// React
import React, {
  useEffect,
  useState,
  Fragment,
  useMemo,
  useRef
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

  const [filesList, setFilesList] = useState([]);
  const [loadingFilesList, setLoadingFilesList] = useState(false);
  const [day, setDay] = useState("");
  const [days, setDays] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [imageName, setImageName] = useState("");

  const listRef = useRef();

  const { itemHeight, itemWidth, menuWidth } = useMemo(() => {
    return {
      itemHeight: 150,
      itemWidth: 290,
      menuWidth: 310,
    };
  }, []);

  const dirPath = `${pageOptions.options.imagesDirPath}`;

  useEffect(() => {
    fetchJson(dirPath)
      .then((res) => {
        let _days = res.filter(item => item.type === "directory").map((item) => {
          let date = item.name;
          let year = date.substring(0, 4);
          let month = date.substring(4, 6);
          let day = date.substring(6, 8);
          return {
            date: item.name,
            formattedDate: day + "/" + month + "/" + year,
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
    const fetchFiles = async () => {
      try {
        const res = await fetchJson(`${dirPath}/${day}/`);
        const _filesList = res.filter(item => item.name.includes('.jpg')).map((item) => {
          return item.name;
        });
        setFilesList(_filesList);
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

  const renderItem = ({ index }) => {
    let item = filesList[index];

    return (
      <Grid
        item
        key={index}
        sx={{
          width: "100%",
          height: "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 1,
          // overflow: 'visible',
        }}
      >
        <Card
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "100%", cursor: "pointer" }}
            // onClick={() => onClickImage(`${dirPath}${day}/${item}`, item)}
            image={`${dirPath}/${day}/${item}`}
            alt={item}
          />
          <CardActions
            sx={{
              maxHeight: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography textAlign="center" variant="caption" >{`${item}`}</Typography>
            <Tooltip title={t("download")}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => downloadImage(`${dirPath}${day}/${item}`, item.replace('.jpg', ''))}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  const onClickImage = (imgPath, imgName) => {
    setImagePath(imgPath);
    setImageName(imgName);
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
                <Autocomplete
                  fullWidth
                  autoComplete
                  label="Date"
                  variant="outlined"
                  color="secondary"
                  sx={{
                    width: "100%",
                    height: "auto",
                  }}
                  value={day[0]}
                  options={days}
                  defaultValue={days[0]}
                  onChange={(_, newValue) => setDay(newValue?.date)}
                  renderInput={(params) => <TextField {...params} />}
                  getOptionLabel={(option) => option?.formattedDate ?? ""}
                  isOptionEqualToValue={(option, value) => option?.date === value?.date}
                />
                <Grid
                  id={'grid'}
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: "100%", }}
                >
                  {loadingFilesList ?
                    <Grid id={'circular progress'}>
                      <CircularProgress />
                    </Grid>
                    : filesList.length === 0 && day ? (
                      <Grid id={'empty-list-text'}>
                        <Typography variant="h6" textAlign="center">{t("Empty List")}</Typography>
                      </Grid>
                    ) : filesList.length > 0 && !loadingFilesList && (
                      <Box
                        id={'BOX'}
                        width={menuWidth}
                        sx={{
                          bgcolor: 'background.paper',
                          height: '1000px', // Valor truncado provisório
                          width: '100%',
                          gap: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          p: 1,
                          flexGrow: 1
                        }}
                      >
                        <AutoSizer id={'autosizer'}>
                          {({ height, width }) => (
                            <FixedSizeList
                              ref={listRef}
                              height={height}
                              width={width}
                              itemSize={itemHeight}
                              itemCount={filesList.length}
                            >
                              {renderItem}
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
              {filesList.length > 0 && !imagePath ? (
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
                        <Tooltip title={t("download")}>
                          <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => downloadImage(imagePath, imageName.replace('.jpg', ''))}
                          >
                            <Typography textAlign="center" sx={{ mr: "1rem" }}>{`${imageName}`}</Typography>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
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