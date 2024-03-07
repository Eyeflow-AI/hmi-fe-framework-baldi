// React
import React, {
  useEffect,
  useState,
  Fragment
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
//import GetSelectedStation from "../../utils/Hooks/GetSelectedStation";

// Third-party
import { useTranslation } from "react-i18next";
import { downloadImage } from "sdk-fe-eyeflow";
import { CardActions } from "@mui/material";

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

  //const { _id : stationId } = GetSelectedStation();
  const [filesList, setFilesList] = useState([]);
  const [loadingFilesList, setLoadingFilesList] = useState(false);
  const [day, setDay] = useState("");
  const [days, setDays] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [imageName, setImageName] = useState("");

  //const dirPath = `/opt/eyeflow/data/event-image/${day}`;
  //const dirPath = 'http://192.168.2.40:6031/data/event-image/';
  const dirPath = `${pageOptions.options.imagesDirPath}`;

/*   const listFileFromWS = (dirPath) => {
    let selectedDay = day.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')

    API.get.filesListMongo({ params: { dirPath, selectedDay: selectedDay, station: stationId, listImages: true } }, setLoadingFilesList)
      .then((data) => {
        console.log(data);
        setImagePath("");
        setImageName("");
        let _filesList = [];
        data.docs.map((item) => {
          let fileURL = item.event_data.last_inspection.images[0].image_url;
          let fileName = fileURL.split('/').pop();
          _filesList.push({ name: fileName, fileURL });
        })
        checkImgExistance(_filesList)
        setFilesList(_filesList);
      })
      .catch((err) => {
        console.log(err);
      });
  } */

  useEffect(() => {
    fetchJson(dirPath)
      .then((res) => {
        let _days = res.filter(item => item.type === "directory").map((item) => {
          let date = item.name;
          let year = date.substring(0,4);
          let month = date.substring(4,6);
          let day = date.substring(6,8);
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
    fetchJson(`${dirPath}/${day}/`)
      .then((res) => {
        let _filesList = res.filter(item => item.name.includes('.jpg')).map((item) => {
          return item.name;
        });
        setFilesList(_filesList);
        setLoadingFilesList(false);
      })
      .catch((err) => {
        console.log(err);
      }
    );
  }, [dirPath, day]);

  //LOGICA VELHA
  /* const [loading, setLoading] = useState(false);

  const getFolderList = () => {
    API.get.folderListImages({ params: { dirPath, fileURL: true } }, setLoading)
      .then((data) => {
        setFilesList(data.files);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    if (!day) return;
    getFolderList();
  }, [dirPath, day]); */
  //FIM LOGICA VELHA

/*   const checkImgExistance = (imgFiles) => {
    imgFiles.map((item) => {
      let img = new Image();
      img.src = item.fileURL;
      img.onload = function () {
        console.log('image exists');
      };
      img.onerror = function () {
        console.log('image does not exist');
        // remove item from imgFiles
        imgFiles = imgFiles.filter((imgFile) => imgFile.fileURL !== item.fileURL);
        setFilesList(imgFiles);
      };
    })
  } */

/*   useEffect(() => {
    if (!day) return;
    listFileFromWS(`${pageOptions.options.imagesDirPath}${day}`);
  }, [day]); */

  const onClickImage = (imgPath, imgName) => {
    setImagePath(imgPath);
    setImageName(imgName);
  }

/*   const getDays = () => {
    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let days = [today, yesterday];
    days = days.map((day) => {
      let year = day.getFullYear();
      let month = day.getMonth() + 1;
      let dayOfMonth = day.getDate();
      return `${year}${month < 10 ? "0" + month : month}${dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth}`;
    });
    setDays(days);
  } */

/*   useEffect(() => {
    getDays();
  },[]); */

  return (
    <Fragment>
      <PageWrapper>
        {({ width, height }) => (
          <Box width={width} height={height} sx={style.mainBox}>
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
                  overflowY: "auto",
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
                  value={day}
                  options={days}
                  onChange={ (_, newValue) => setDay(newValue?.date ?? "")}
                  getOptionLabel={(option) => option?.formattedDate ?? ""}
                  defaultValue={days?.[0] ?? {}}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: "100%", }}
                >
                  {loadingFilesList?
                  //loading?
                    <Grid>
                      <CircularProgress />
                    </Grid>
                  : filesList.length === 0 && day? (
                    <Grid>
                      <Typography variant="h6" textAlign="center">{t("Empty List")}</Typography>
                    </Grid>
                  ): filesList.map((item, index) => (
                    <Grid
                      item
                      //xs={12} sm={6} md={4} lg={3}
                      key={index}
                      sx={{
                        //margin: "0.1rem 0.3rem",
                        width: "100%",
                        height: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 1,
                        overflow: 'visible',
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
                          //flexWrap: "wrap",
                          //overflow: "hidden",
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{ width: "100%", height: "100%", cursor: "pointer" }}
                          onClick={() => onClickImage(`${dirPath}${day}/${item}`, item)}
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
                              //sx={{ padding: "0", ml: "1rem" }}
                              onClick={() => downloadImage(`${dirPath}${day}/${item}`, item.replace('.jpg',''))}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
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
              {filesList.length > 0 && !imagePath? (
                <Box>
                  <Typography variant="h6" textAlign="center">{t("select_an_image_for_download")}</Typography>
                </Box>
              ):(
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
                      onClick={() => downloadImage(imagePath, imageName.replace('.jpg',''))}
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