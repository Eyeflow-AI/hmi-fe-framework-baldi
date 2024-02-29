import { useState, useEffect, useRef } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Box";
import Box from "@mui/material/Box";

import fetchJson from "../utils/functions/fetchJson";

import { colors } from "sdk-fe-eyeflow";

const styleSx = {
  mainBoxSx: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    // border: "5px solid red",
    position: "relative",
  },
  imageBoxSx: {
    position: "block",
    position: "absolute",
    width: "100%",
    height: "calc(100% - 40px)",
    marginTop: "40px",
    display: "inline-block",
    // border: "1px solid green",
  },
  headerBoxSx: {
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 1,
    paddingRight: 1,
    borderRadius: "4px 4px 0 0",
  },
  textDate: {
    fontSize: "0.8rem",
    // color: 'text.secondary',
  },
  circularProgressSx: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-20px",
    marginLeft: "-20px",
  },
};

const imageStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
  // paddingTop: 80,
  objectFit: "contain",
  // opacity: "1",
  display: "block",
  // border: "1px solid blue",
  left: "50%",
};

const loadingImageStyle = Object.assign({}, imageStyle, {
  filter: "blur(2px)",
  opacity: "0.7",
});

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
  setExternalText,
  regions,
  setColor,
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
    if (options.severalAnnotations) {
      let totalRegions = Array.isArray(regions) && regions.length;
      let okRegions = 0;
      let ngRegions = 0;
      (Array.isArray(regions) && regions.length > 0 ? regions : []).forEach(
        (region, i) => {
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

          // ctx.strokeStyle = bboxRegion?.color ?? colors.eyeflow.green.dark;
          ctx.strokeStyle = Object.keys(bboxRegion).includes("found")
            ? bboxRegion?.found
              ? colors.eyeflow.green.dark
              : colors.eyeflow.red.dark
            : bboxRegion?.color ?? colors.eyeflow.green.dark;

          if (Object.keys(bboxRegion).includes("found")) {
            if (bboxRegion?.found) {
              okRegions += 1;
            } else {
              ngRegions += 1;
            }
          }

          ctx.lineWidth = 3;
          ctx.strokeRect(
            parseInt(x_min * scale - 1),
            parseInt(y_min * scale + 1),
            parseInt((x_max - x_min) * scale),
            parseInt((y_max - y_min) * scale)
          );
          if (options?.showLabels) {
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
          }
          // }
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

            if (options?.showLabels) {
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
            }
          });
        }
      );

      if (okRegions || ngRegions) {
        // ctx.fillStyle = colors.eyeflow.green.dark;
        // ctx.font = "50px Arial";
        // if (ngRegions > 0) ctx.fillStyle = colors.eyeflow.red.dark;
        // ctx.fillText(
        //   `${okRegions}/${totalRegions}`,
        //   parseInt(1 * scale + 20),
        //   parseInt(1 * scale + 50)
        // );
        if (ngRegions > 0) {
          setColor("error.main");
        } else {
          setColor("success.main");
        }
        setExternalText(`${okRegions}/${totalRegions}`);
      }
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
    }
  };
};

export default function ImageCard({
  title,
  eventTime,
  imageData,
  color,
  height,
  width,
  useMask,
  showLabels,
}) {
  const [imageLoading, setImageLoading] = useState(true);
  const [detectionsLoading, setDetectionsLoading] = useState(false);
  const loading = imageLoading || detectionsLoading;
  const [eventData, setEventData] = useState(null);
  const [detections, setDetections] = useState([]);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [adjacentText, setAdjacentText] = useState("");
  const [newColor, setNewColor] = useState("");

  const imageDataURL = imageData?.image_data_url;
  const _imageURL = imageData?.image_url;
  // const imageDataURL = "/assets/cat.webp";
  // const imageSrc = imageData?.image_url;

  const imageURLRef = useRef([]);
  const [imageURL, setImageURL] = useState(null);

  // console.log({feedbackInfo})

  const setImageURLRef = (newImageURLS) => {
    imageURLRef.current = newImageURLS;
    setImageURL(newImageURLS);
  };

  const setAnnotatedImage = ({ url }) => {
    setImageURLRef(url);
  };

  useEffect(() => {
    if (!_imageURL) {
      setImageLoading(false);
      return;
    }
    setImageLoading(true);
  }, [_imageURL]);

  useEffect(() => {
    if (imageDataURL) {
      setDetectionsLoading(true);
      // let url = imageDataURL.replace("192.168.0.201", "192.168.2.40");
      let url = imageDataURL;
      let detections = [];

      fetchJson(`${url}?time=${Date.now()}`)
        .then((data) => {
          setEventData(data);
          let _detections = useMask ? data?.mask_result : data?.detections;
          if (data.type === "checklist" && Array.isArray(_detections)) {
            for (let detection of _detections ?? []) {
              detections.push({ ...detection });
            }
          }
          setDetections(detections);
          setDetectionsLoading(false);
        })
        .catch((err) => {
          setEventData(null);
          setDetectionsLoading(false);
        })
        .finally(() => {
          if (_imageURL) {
            // let url = _imageURL.replace("192.168.0.201", "192.168.2.40");
            let url = _imageURL;
            url = `${url}?time=${Date.now()}`;
            getAnnotatedImg({
              image: url,
              regions: detections,
              scale: 1,
              setAnnotatedImage,
              setExternalText: setAdjacentText,
              setColor: setNewColor,
              options: {
                severalAnnotations: true,
                returnCanvasURL: false,
                showLabels,
              },
            });
          } else {
            setEventData(null);
          }
        });
    } else {
      setEventData(null);
    }
  }, [imageDataURL]);

  const onImageLoad = (event) => {
    setImageWidth(event.target.naturalWidth);
    setImageHeight(event.target.naturalHeight);
    setImageLoading(false);
  };

  useEffect(() => {
    setDetections([]);
    setDetectionsLoading(false);
    setImageLoading(true);
    setEventData(null);
    setAdjacentText("");
    setNewColor("");
  }, []);

  return (
    <Box sx={styleSx.mainBoxSx} width={width} height={height}>
      <Box
        id="header-box"
        sx={styleSx.headerBoxSx}
        bgcolor={color === "error.main" && newColor ? newColor : "primary.main"}
      >
        {title && <Typography>{title}</Typography>}
        <Typography>{adjacentText}</Typography>
        <Typography sx={styleSx.textDate}>{eventTime}</Typography>
      </Box>
      <Box id="image-card" sx={styleSx.imageBoxSx}>
        <center
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            height: "100%",
            // border: "1px solid red"
          }}
        >
          <img
            alt=""
            src={imageURL}
            // src={"/assets/cat.webp"}
            style={loading ? loadingImageStyle : imageStyle}
            onLoad={onImageLoad}
          />
        </center>
        {loading && <CircularProgress sx={styleSx.circularProgressSx} />}
      </Box>
    </Box>
  );
}
