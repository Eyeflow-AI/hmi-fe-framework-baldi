import React, { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Box";
import Box from "@mui/material/Box";

import Tooltip from "../Wrapper/Tooltip";

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
    // position: "absolute",
    width: "100%",
    // height: "calc(100% - 50px)",
    height: "inherit", // 'calc(100% - 50px)
    // marginTop: "50px",
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
  imageStyle: {
    maxWidth: "100%",
    maxHeight: "100%",
    // paddingTop: 80,
    objectFit: "contain",
    // opacity: "1",
    display: "block",
    // border: "1px solid blue",
    left: "50%",
  },
};

const loadingImageStyle = Object.assign({}, styleSx.imageStyle, {
  filter: "blur(2px)",
  opacity: "0.7",
});

export default function ImageCard({
  name,
  tag,
  componentsInfo,
  style,
  metadata,
  setComponentsInfo,
}) {
  console.log({ ImageCard: name, tag, componentsInfo });
  const [onImageLoading, setOnImageLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [adjacentText, setAdjacentText] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [tooltip, setTooltip] = useState({});
  // const [_name, _setName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [detections, setDetections] = useState([]);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [_style, _setStyle] = useState({});

  useEffect(() => {
    if (style) {
      let __style = Object.assign({}, styleSx.mainBoxSx, style);
      _setStyle(__style);
    } else {
      _setStyle(styleSx.mainBoxSx);
    }
  }, [style]);

  useEffect(() => {
    if (componentsInfo && typeof componentsInfo === "object") {
      const component =
        componentsInfo.find((item) => item?.tag === tag && item?.name === name)
          ?.output ?? {};
      // console.log({ component });
      setTitle(component?.title);
      setAdjacentText(component?.adjacentText);
      setTimestamp(component?.timestamp);
      setImageURL(component?.imageURL);
      setImageCaption(component?.imageCaption);
      setTooltip(component?.tooltip);
      setOnImageLoading(true);
      setDetections(component?.detections);
      let status = component?.status ?? "";
      let backgroundColor =
        component?.backgroundColor && component?.backgroundColor !== ""
          ? component?.backgroundColor
          : colors.statuses[status];
      setBackgroundColor(backgroundColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

  console.log({ onImageLoading });

  useEffect(() => {
    if (onImageLoading) {
      setLoading(false);
      setOnImageLoading(false);
    }
  }, [onImageLoading]);

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
    // setExternalText,
    regions,
    options = {
      severalAnnotations: false,
      returnCanvasURL: false,
      info: {},
    },
  }) => {
    console.log({
      image,
      index,
      scale,
      setAnnotatedImage,
      regions,
      options,
    });
    let strokeStyle = options.strokeStyle || colors.eyeflow.green.dark;
    let expandBox = options.expandBox || 1;
    let img = new Image();
    img.src = image;

    console.log({ src: img.src });
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
        // console.log({regions},"dri");
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
            // if (options?.showLabels) {
            //   ctx.font = "30px Arial";
            //   ctx.fillStyle = "white";
            //   ctx.fillText(
            //     `${bboxRegion?.label}`,
            //     parseInt(x_min * scale - 3),
            //     parseInt(y_min * scale - 12)
            //   );
            //   ctx.fillStyle = strokeStyle;
            //   ctx.fillText(
            //     `${bboxRegion?.label}`,
            //     parseInt(x_min * scale - 2),
            //     parseInt(y_min * scale - 10)
            //   );
            // }
            // }
            (region?.detections ?? [])?.forEach((detection) => {
              let bb = detection?.[0];
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

              // if (options?.showLabels) {
              //   ctx.font = "30px Arial";

              //   ctx.fillStyle = "white";
              //   ctx.fillText(
              //     `${bb?.label}`,
              //     parseInt(x_min * scale - 3),
              //     parseInt(y_min * scale - 12)
              //   );
              //   ctx.fillStyle = strokeStyle;
              //   ctx.fillText(
              //     `${bb?.label}`,
              //     parseInt(x_min * scale - 2),
              //     parseInt(y_min * scale - 10)
              //   );
              // }
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

            console.log({
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

  useEffect(() => {
    if (imageURL) {
      let url = imageURL;
      url = `${url}?time=${Date.now()}`;
      getAnnotatedImg({
        image: url,
        regions: detections,
        scale: 1,
        setAnnotatedImage,
        // setExternalText: setAdjacentText,
        options: {
          severalAnnotations: true,
          returnCanvasURL: false,
          // showLabels,
        },
      });
    }
  }, [
    imageURL,
    // imageDataURL,
    // showLabels,
    detections,
    setAnnotatedImage,
    // setExternalText,
  ]);

  return (
    <Tooltip tooltip={tooltip}>
      <Box sx={{ ..._style }}>
        <Box
          id="header-box"
          sx={styleSx.headerBoxSx}
          bgcolor={backgroundColor ?? "primary.main"}
        >
          {title && <Typography>{title}</Typography>}
          <Typography>{adjacentText}</Typography>
          <Typography sx={styleSx.textDate}>{timestamp}</Typography>
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
              alt={imageCaption}
              src={annotatedImage?.url ?? imageURL}
              // src={"/assets/cat.webp"}
              style={loading ? loadingImageStyle : styleSx.imageStyle}
              // onLoad={onImageLoad}
            />
          </center>
          {loading && <CircularProgress sx={styleSx.circularProgressSx} />}
        </Box>
      </Box>
    </Tooltip>
  );
}
