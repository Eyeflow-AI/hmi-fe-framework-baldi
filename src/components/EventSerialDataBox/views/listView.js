// React
import React, { useEffect, useState, useRef } from "react";

// Design
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box/";
import CardMedia from "@mui/material/CardMedia";

// Internal
import ImageDialog from "../../ImageDialog";
import API from "../../../api";
import GetSelectedStation from "../../../utils/Hooks/GetSelectedStation";
import GetStationsList from "../../../utils/Hooks/GetStationsList";
import IPV6toIPv4 from "../../../utils/functions/ipv4Format";

// Third-party
import { useTranslation } from "react-i18next";
import { colors } from "sdk-fe-eyeflow";
// import { Table } from "@mui/material";

// const GRID_SIZES = {
//   1: 12,
//   2: 12,
//   3: 6,
//   4: 6,
//   5: 6,
//   6: 6,
// }

const IMAGE_SIZES = {
  1: "900px",
  2: "600px",
  3: "250px",
  4: "350px",
  5: "350px",
  6: "350px",
};

function expandCoordinates({
  imgWidth,
  imgHeight,
  x_min,
  x_max,
  y_min,
  y_max,
  expandBox,
}) {
  if (expandBox) {
    let xc = (x_max + x_min) / 2;
    let halfWidth = (x_max - x_min) / 2;
    let yc = (y_max + y_min) / 2;
    let halfHeight = (y_max - y_min) / 2;

    x_min = Math.round(xc - halfWidth * expandBox);
    if (x_min < 0) {
      x_min = 0;
    }
    x_max = Math.round(xc + halfWidth * expandBox);
    if (x_max > imgWidth) {
      x_max = imgWidth;
    }
    y_min = Math.round(yc - halfHeight * expandBox);
    if (y_min < 0) {
      y_min = 0;
    }
    y_max = Math.round(yc + halfHeight * expandBox);
    if (y_max > imgHeight) {
      y_max = imgHeight;
    }
  }
  return [x_min, x_max, y_min, y_max];
}

const getAnnotatedImg = ({
  image,
  // , bbox
  index,
  scale,
  setAnnotatedImage,
  regions,
  options = {
    severalAnnotations: false,
    returnCanvasURL: false,
    info: {},
  },
}) => {
  let strokeStyle = options.strokeStyle || colors.eyeflow.green.dark;
  let expandBox = options.expandBox || 1;
  var img = new Image();
  img.src = image;
  img.crossOrigin = "anonymous";

  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const notAnnotatedCanvas = document.createElement("canvas");
    notAnnotatedCanvas.width = img.width;
    notAnnotatedCanvas.height = img.height;
    const notAnnotatedCtx = notAnnotatedCanvas.getContext("2d");
    notAnnotatedCtx.drawImage(img, 0, 0, img.width, img.height);

    // if (bboxRegion) {
    //   // console.log({ bboxRegion })
    //   let [x_min, x_max, y_min, y_max] = expandCoordinates({
    //     imgWidth: img.width / scale,
    //     imgHeight: img.height / scale,
    //     x_min: bboxRegion?.x_min ?? bboxRegion?.bbox?.x_min,
    //     x_max: bboxRegion?.x_max ?? bboxRegion?.bbox?.x_max,
    //     y_min: bboxRegion?.y_min ?? bboxRegion?.bbox?.y_min,
    //     y_max: bboxRegion?.y_max ?? bboxRegion?.bbox?.y_max,
    //     expandBox
    //   });
    //   ctx.strokeStyle = bboxRegion?.color ?? colors.eyeflow.green.dark;
    //   ctx.lineWidth = 3;
    //   ctx.strokeRect(
    //     parseInt(x_min * scale - 1),
    //     parseInt(y_min * scale + 1),
    //     parseInt((x_max - x_min) * scale),
    //     parseInt((y_max - y_min) * scale)
    //   );

    //   ctx.lineWidth = 3;
    //   ctx.strokeRect(
    //     parseInt(x_min * scale),
    //     parseInt(y_min * scale),
    //     parseInt((x_max - x_min) * scale),
    //     parseInt((y_max - y_min) * scale)
    //   );

    // }
    if (options.severalAnnotations) {
      (Array.isArray(regions) && regions.length > 0 ? regions : []).forEach(
        (region, i) => {
          // if (bboxRegion) {
          // console.log({ bboxRegion })
          let bboxRegion = region;
          let [x_min, x_max, y_min, y_max] = expandCoordinates({
            imgWidth: img.width / scale,
            imgHeight: img.height / scale,
            x_min: bboxRegion?.x_min ?? bboxRegion?.bbox?.x_min,
            x_max: bboxRegion?.x_max ?? bboxRegion?.bbox?.x_max,
            y_min: bboxRegion?.y_min ?? bboxRegion?.bbox?.y_min,
            y_max: bboxRegion?.y_max ?? bboxRegion?.bbox?.y_max,
            expandBox,
          });

          ctx.strokeStyle = bboxRegion?.color ?? colors.eyeflow.green.dark;
          ctx.lineWidth = 3;
          ctx.strokeRect(
            parseInt(x_min * scale - 1),
            parseInt(y_min * scale + 1),
            parseInt((x_max - x_min) * scale),
            parseInt((y_max - y_min) * scale)
          );

          ctx.lineWidth = 3;
          ctx.strokeRect(
            parseInt(x_min * scale),
            parseInt(y_min * scale),
            parseInt((x_max - x_min) * scale),
            parseInt((y_max - y_min) * scale)
          );

          ctx.font = "30px Arial";
          ctx.fillStyle = "white";
          ctx.fillText(
            `${bboxRegion?.label}`,
            parseInt(x_min * scale - 3),
            parseInt(y_min * scale - 12)
          );
          ctx.fillStyle = strokeStyle;
          ctx.fillText(
            `${bboxRegion?.label}`,
            parseInt(x_min * scale - 2),
            parseInt(y_min * scale - 10)
          );

          // }
          // console.log({ region });
          (region?.detections ?? [])?.forEach((detection) => {
            let bb = detection?.[0];
            // console.log({bb});
            let [x_min, x_max, y_min, y_max] = expandCoordinates({
              imgWidth: img.width / scale,
              imgHeight: img.height / scale,
              x_min: bb?.x_min ?? bb?.bbox?.x_min,
              x_max: bb?.x_max ?? bb?.bbox?.x_max,
              y_min: bb?.y_min ?? bb?.bbox?.y_min,
              y_max: bb?.y_max ?? bb?.bbox?.y_max,
              expandBox,
            });

            strokeStyle = bb?.color ?? colors.eyeflow.green.dark;
            ctx.strokeStyle = strokeStyle;
            // console.log({ strokeStyle })
            ctx.lineWidth = 3;
            ctx.strokeRect(
              parseInt(x_min * scale - 1),
              parseInt(y_min * scale + 1),
              parseInt((x_max - x_min) * scale),
              parseInt((y_max - y_min) * scale)
            );

            ctx.lineWidth = 3;
            ctx.strokeRect(
              parseInt(x_min * scale),
              parseInt(y_min * scale),
              parseInt((x_max - x_min) * scale),
              parseInt((y_max - y_min) * scale)
            );

            ctx.font = "30px Arial";

            ctx.fillStyle = "white";
            ctx.fillText(
              `${bb?.label}`,
              parseInt(x_min * scale - 3),
              parseInt(y_min * scale - 12)
            );
            ctx.fillStyle = strokeStyle;
            ctx.fillText(
              `${bb?.label}`,
              parseInt(x_min * scale - 2),
              parseInt(y_min * scale - 10)
            );
          });
        }
      );
      if (options?.returnCanvasURL) {
        let canvasURL = canvas.toDataURL("image/jpeg");
        return canvasURL;
      } else {
        if (options?.camera) {
          setAnnotatedImage(options.camera, canvas.toDataURL("image/jpeg"));
        } else {
          setAnnotatedImage({
            index,
            url: canvas.toDataURL("image/jpeg"),
            notAnnotatedURL: notAnnotatedCanvas.toDataURL("image/jpeg"),
          });
        }
      }
    } else {
      // let [x_min, x_max, y_min, y_max] = expandCoordinates(
      //   img.width / scale,
      //   img.height / scale,
      //   bbox.x_min,
      //   bbox.x_max,
      //   bbox.y_min,
      //   bbox.y_max,
      //   expandBox
      // );
      // strokeStyle = bbox?.color ?? colors.eyeflow.green.dark;
      // ctx.strokeStyle = strokeStyle;
      // ctx.lineWidth = 3;
      // ctx.strokeRect(
      //   parseInt(x_min * scale - 1),
      //   parseInt(y_min * scale + 1),
      //   parseInt((x_max - x_min) * scale),
      //   parseInt((y_max - y_min) * scale)
      // );
      // ctx.strokeStyle = strokeStyle;
      // ctx.lineWidth = 3;
      // ctx.strokeRect(
      //   parseInt(x_min * scale),
      //   parseInt(y_min * scale),
      //   parseInt((x_max - x_min) * scale),
      //   parseInt((y_max - y_min) * scale)
      // );
      // if (options?.returnCanvasURL) {
      //   let canvasURL = canvas.toDataURL("image/jpeg");
      //   return canvasURL;
      // }
      // else {
      //   if (options?.camera) {
      //     setAnnotatedImage(options.camera, canvas.toDataURL("image/jpeg"));
      //   }
      //   else {
      //     // setAnnotatedImage(canvas.toDataURL("image/jpeg"));
      //     setAnnotatedImage({ index, url: canvas.toDataURL("image/jpeg"), notAnnotatedURL: notAnnotatedCanvas.toDataURL("image/jpeg") });
      //   }
      // }
    }
  };
};

const InspectionList = ({ data, result }) => {
  // console.log({ data, calc: Object.keys(data).length * 3 });

  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        // backgroundColor: result
        //   ? `${colors.statuses["ok"]}50`
        //   : `${colors.statuses["ng"]}50`,
        // border: `.02rem solid ${colors.eyeflow.blue.medium}`,
        bgcolor: "background.paper",

        flexGrow: 1,
        overflow: "hidden",
        width: "400px",
        height: `calc(3rem + ${Object.keys(data).length * 3}rem) - 1px`,
        boxShadow: "#00000020 10px 10px",
        flexDirection: "column",
      }}
      key={`table-view`}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "3rem",
          // border: `.02rem solid ${colors.eyeflow.blue.medium}`,
          // bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            // border: `.02rem solid ${colors.eyeflow.blue.medium}`,
          }}
        >
          <Typography
            textAlign={"center"}
            textTransform={"uppercase"}
            variant="h4"
          >
            {t("element")}
          </Typography>
        </Box>
        <Box
          sx={{
            height: "100%",
            width: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            // border: `.02rem solid ${colors.eyeflow.blue.medium}`,
          }}
        >
          <Typography
            textAlign={"center"}
            textTransform={"uppercase"}
            variant="h4"
          >
            {t("status")}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "calc(100%)",
          overflowY: "auto",
          border: `.02rem solid ${colors.eyeflow.blue.medium}`,
        }}
      >
        {Object.entries(data).map(([key, value], index) => {
          // console.log({ key, value });
          // return <div key={index}>teste</div>;
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "3rem",
                backgroundColor:
                  value == "ok"
                    ? `${colors.statuses["ok"]}50`
                    : `${colors.statuses["ng"]}50`,
              }}
              key={`${index}-table-item`}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  border: `.02rem solid ${colors.eyeflow.blue.medium}`,
                }}
              >
                <Typography
                  textAlign={"center"}
                  textTransform={"uppercase"}
                  variant="p"
                >
                  {key}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: "100%",
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  border: `.02rem solid ${colors.eyeflow.blue.medium}`,
                }}
              >
                <Typography
                  textAlign={"center"}
                  textTransform={"uppercase"}
                  variant="p"
                >
                  {value}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default function ListView({
  loading,
  inspections,
  config,
  appBarHeight,
  isSelectedSerialRunning,
  serialId,
}) {
  // console.log({loading, inspections, config, appBarHeight, isSelectedSerialRunning, serialId})

  const { t } = useTranslation();

  const hmiFilesWs = window.app_config?.hosts?.["hmi-files-ws"]?.url ?? "";
  const [openDialog, setOpenDialog] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [otherImages, setOtherImages] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dataToUse, setDataToUse] = useState({});
  const imageURLSRef = useRef([]);
  const [imageURLS, setImageURLS] = useState({});
  const [loadingFeedback, setLoadingFeedback] = useState([]);
  const { _id: stationId } = GetSelectedStation();
  const stationsList = GetStationsList();
  const [feedbackInfo, setFeedbackInfo] = useState({});

  // console.log({feedbackInfo})

  const setImageURLSRef = (newImageURLS) => {
    imageURLSRef.current = newImageURLS;
    setImageURLS(newImageURLS);
  };
  const setAnnotatedImage = ({ index, url, notAnnotatedURL }) => {
    let _imageURLS = { ...imageURLSRef.current };
    _imageURLS = {
      annotated: url,
      notAnnotated: notAnnotatedURL,
    };
    setImageURLSRef({ ..._imageURLS });
  };

  const drawImage = async ({
    url,
    index,
    sizes,
    regions,
    isSelectedSerialRunning = false,
    imageInfo,
  }) => {
    const imageScale = imageInfo?.image?.image_scale ?? 1;
    // let bboxes = [];
    // region?.tests?.forEach((test) => {
    //   // console.log({bboxes, region})
    //   bboxes = [...bboxes, ...test?.detections?.filter(detection =>
    //     (detection?.image?.image_file === region?.image?.image_file || detection?.image_file === region?.image_file) && ((Object.keys(detection)?.includes('inframe') && detection?.inframe) || Object.keys(detection)?.includes('in_frame')
    //     )) ?? []];
    // });
    let absolute_path = "";
    let _url = "";
    if (isSelectedSerialRunning) {
      absolute_path = imageInfo?.stage_image_path;
    } else {
      absolute_path = imageInfo?.absolute_image_path;
    }
    if (absolute_path) {
      // absolute_path = absolute_path.replace('/opt/eyeflow/data', 'eyeflow_data');
      _url = `${url}/${absolute_path}/${
        imageInfo?.image_file ?? imageInfo?.image_file
      }`;
    } else {
      _url = `${url}/eyeflow_data/event_image/${
        imageInfo?.image_path ?? imageInfo?.image_path
      }/${imageInfo?.image_file ?? imageInfo?.image_file}`;
    }
    // console.log({_url, isSelectedSerialRunning, region, name: region.region, absolute_path, bboxes})
    getAnnotatedImg({
      // image: `${url}/${region?.image?.image_path ?? region?.image_path}/${region?.image?.image_file ?? region?.image_file}`
      image: `${_url}`,
      regions,
      // , bbox: bboxes
      scale: imageScale,
      index,
      setAnnotatedImage,
      options: {
        severalAnnotations: true,
        returnCanvasURL: false,
      },
    });
  };

  const handleFeedback = ({ index, regionName, serialId, obj = null }) => {
    let _loadingFeedback = [...loadingFeedback];
    _loadingFeedback[index] = true;
    setLoadingFeedback([..._loadingFeedback]);
    if (obj) {
      let imageId = obj?.originalUrl?.split("/")?.pop()?.replace(".jpg", "");
      let info = {
        index,
        regionName,
        serialId,
        url: obj?.originalUrl,
        imageId,
      };

      API.put
        .feedbackOtherImages({
          info,
          stationId,
          serialId,
        })
        .then((res) => {})
        .catch(console.log)
        .finally(() => {
          _loadingFeedback[index] = false;
          setLoadingFeedback([..._loadingFeedback]);
        });
    } else {
      API.put
        .feedbackSerial({
          serialId,
          regionName,
          stationId,
        })
        .then((res) => {})
        .catch(console.log)
        .finally(() => {
          _loadingFeedback[index] = false;
          setLoadingFeedback([..._loadingFeedback]);
        });
    }
  };

  const handleImagePath = ({
    image,
    otherImages = null,
    feedback,
    index,
    name,
  }) => {
    setImagePath(image);
    if (otherImages) {
      setOtherImages(otherImages);
    }
    let info = {
      feedback: feedback,
      index: index,
      name: name,
    };
    setFeedbackInfo(info);
  };

  useEffect(() => {
    if (!openDialog) {
      setDialogTitle("");
      setImagePath("");
      setOtherImages(null);
      setFeedbackInfo({});
    }
  }, [openDialog]);

  useEffect(() => {
    let filesWSToUse = hmiFilesWs;

    let station = stationsList?.find((station) => station?._id === stationId);

    if (inspections.length === 1) {
      let detections = [
        ...inspections[0]?.event_data?.inspection_result?.detections,
      ];
      const imageInfo = inspections[0]?.event_data?.inspection_result?.image;
      detections = detections.map((detection) => {
        if (Array.isArray(detection)) {
          detection.forEach((det) => {
            return det;
          });
        } else {
          return detection;
        }
      });
      console.log({ detections });
      if (isSelectedSerialRunning) {
        let edge = station?.edges?.find(
          (edge) =>
            edge?.host === `http://${IPV6toIPv4(inspections?.[0]?.host)}`
        );
        let url = `${edge?.host}:${edge?.filesPort}`;
        filesWSToUse = url;
        // console.log({edge, url, inspection: inspections[0], station})
      }
      // console.log({filesWSToUse})
      const _imageURL = {
        annotated: imageURLS?.annotated ?? "",
        notAnnotated: imageURLS?.notAnnotated ?? "",
      };
      // const _loadingFeedback = false;
      // detections.forEach((inspection, index) => {
      //   _imagesURLS.push({
      //     annotated: imagesURLS?.[index]?.annotated ?? '',
      //     notAnnotated: imagesURLS?.[index]?.notAnnotated ?? '',
      //   });
      //   _loadingFeedback.push(false);
      // });
      setImageURLSRef(_imageURL);
      if (
        JSON.stringify(detections) !== JSON.stringify(dataToUse?.detections) ||
        inspections[0]?.event_data?.part_data?.id !==
          dataToUse?.inspection?.name
      ) {
        drawImage({
          url: `${filesWSToUse}`,
          index: 0,
          sizes: IMAGE_SIZES[detections.length],
          regions: detections,
          isSelectedSerialRunning,
          imageInfo,
        });
      }
      let _dataToUse = {
        detections,
        inspection: {
          name: inspections[0]?.event_data?.part_data?.id,
          result: inspections[0]?.event_data?.inspection_result?.ok,
          feedback: inspections[0]?.event_data?.inspection_result?.feedback,
          table: inspections[0]?.event_data?.inspection_result?.table,
        },
      };
      if (JSON.stringify(dataToUse) !== JSON.stringify(_dataToUse)) {
        setDataToUse(_dataToUse);
      }
    } else if (inspections.length > 1) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspections]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageURLS?.annotated);
      URL.revokeObjectURL(imageURLS?.notAnnotated);
      setImageURLSRef([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const HEIGHT = [1, 1, 1, 2, 2, 2];
  const WIDTH = [1, 2, 3, 3, 3, 3];

  return (
    <Box
      width={config.width}
      height="100%"
      // height='100%'
      // direction="column"
      sx={{
        flexWrap: "wrap",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
      id="list_view"
    >
      {!loading && Object.keys(dataToUse).length > 0 ? (
        // dataToUse.map((inspection, index) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: `calc(100% / ${HEIGHT[dataToUse.length - 1]})`,
            width: `calc(100% / ${WIDTH[dataToUse.length - 1]})`,
            flexDirection: "column",
            backgroundColor: dataToUse?.inspection?.result
              ? `${colors.statuses["ok"]}50`
              : `${colors.statuses["ng"]}50`,
            border: `.02rem solid ${colors.eyeflow.blue.medium}`,
            flexGrow: 1,
            overflow: "hidden",
          }}
          key={`box-list-view`}
        >
          <Box
            sx={{
              width: "100%",
              height: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "1.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography textAlign={"center"} textTransform={"uppercase"}>
                {dataToUse?.inspection?.name}
                &nbsp;&nbsp;
                <span
                  style={{
                    color: dataToUse?.inspection?.result
                      ? colors.green
                      : colors.red,
                    fontWeight: "bold",
                  }}
                >
                  {dataToUse?.inspection?.result ? t("OK") : t("NG")}
                </span>
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              {imageURLS?.annotated ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "calc(100vh - 8.1rem)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: ".5rem",
                    color: "black",
                  }}
                >
                  <CardMedia
                    component="img"
                    src={imageURLS?.annotated}
                    style={{
                      height: "100%",
                      display: "block",
                      // width: '100%',
                      margin: "auto",
                      objectFit: "contain",
                      // paddingBottom: '.5rem',
                      cursor: "pointer",
                    }}
                    alt="Inspection"
                    onClick={() => {
                      setDialogTitle(dataToUse?.inspection?.name ?? "");
                      handleImagePath({
                        image: imageURLS?.annotated,
                        otherImages: dataToUse?.inspection?.otherImages,
                        feedback: Boolean(dataToUse?.inspection?.feedback),
                        index: 0,
                        name: dataToUse?.inspection?.tare,
                      });
                      setOpenDialog(true);
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "80%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.eyeflow.blue.light,
                    border: `.02rem solid ${colors.eyeflow.blue.medium}`,
                    borderRadius: ".5rem",
                    color: "black",
                  }}
                >
                  <Typography textAlign={"center"} textTransform={"uppercase"}>
                    {t("no_image")}
                  </Typography>
                </Box>
              )}
              {Object.keys(dataToUse?.inspection?.table).length > 0 && (
                <Box>
                  <InspectionList
                    data={dataToUse?.inspection?.table}
                    result={dataToUse?.inspection?.result}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        // ))
        loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress
              sx={{
                color: "white",
              }}
              size="10rem"
            />
          </Box>
        )
      )}

      <ImageDialog
        open={openDialog}
        setOpen={setOpenDialog}
        imagePath={imagePath}
        title={dialogTitle}
        otherImages={otherImages}
        feedbackLoading={loadingFeedback[feedbackInfo?.index]}
        feedbackFunction={handleFeedback}
        hasFeedback={!isSelectedSerialRunning && !dataToUse?.feedback}
        feedbackObj={{
          feedbackInfo: feedbackInfo,
          regionName: dataToUse?.name,
          serialId: serialId,
        }}
      />
    </Box>
  );
}
