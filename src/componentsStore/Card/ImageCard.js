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

export default function ImageCard({ name, tag, componentsInfo, style }) {
  console.log({ ImageCard: name, tag, componentsInfo });
  const [onImageLoading, setOnImageLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [adjacentText, setAdjacentText] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [color, setColor] = useState("");
  const [tooltip, setTooltip] = useState({});
  const [_name, _setName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
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
        componentsInfo.find((item) => item.tag === tag && item.name === name)
          ?.output ?? {};
      // console.log({ component });
      setTitle(component?.title);
      setAdjacentText(component?.adjacentText);
      setTimestamp(component?.timestamp);
      setImageURL(component?.imageURL);
      setColor(component?.color);
      setImageCaption(component?.imageCaption);
      setTooltip(component?.tooltip);
      setOnImageLoading(true);

      let status = component?.status ?? "";
      let backgroundColor =
        component?.backgroundColor && component?.backgroundColor !== ""
          ? component?.backgroundColor
          : colors.statuses[status];
      setBackgroundColor(backgroundColor);
    }
  }, [componentsInfo]);

  console.log({ onImageLoading });

  useEffect(() => {
    if (onImageLoading) {
      setLoading(false);
      setOnImageLoading(false);
    }
  }, [onImageLoading]);

  useEffect(() => {
    if (name) {
      _setName(name);
    }
  }, [name]);

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
              src={imageURL}
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
