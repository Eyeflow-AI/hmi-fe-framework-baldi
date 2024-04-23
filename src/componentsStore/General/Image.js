import React, { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import Tooltip from "../Wrapper/Tooltip";

import { t } from "i18next";

const styleSx = {
  mainBoxSx: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    // border: "5px solid red",
    position: "relative",
  },
  // imageBoxSx: {
  //   position: "block",
  //   position: "absolute",
  //   width: "100%",
  //   height: "calc(100% - 40px)",
  //   marginTop: "40px",
  //   display: "inline-block",
  //   // border: "1px solid green",
  // },
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
    objectFit: "contain",
    display: "block",
  },
};

const loadingImageStyle = Object.assign({}, styleSx.imageStyle, {
  filter: "blur(2px)",
  opacity: "0.7",
});

export default function Image({
  name,
  tag,
  componentsInfo,
  metadata,
  setComponentsInfo,
}) {
  console.log({ ImageCard: name, tag, componentsInfo });
  const [onImageLoading, setOnImageLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageURL, setImageURL] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [tooltip, setTooltip] = useState({});
  // const [_name, _setName] = useState("");

  useEffect(() => {
    if (componentsInfo && typeof componentsInfo === "object") {
      const component =
        componentsInfo.find((item) => item.tag === tag && item.name === name)
          ?.output ?? {};
      // console.log({ component });
      setImageURL(component?.imageURL);
      setImageCaption(component?.imageCaption);
      setTooltip(component?.tooltip);
      setOnImageLoading(true);
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

  // useEffect(() => {
  //   if (name) {
  //     _setName(name);
  //   }
  // }, [name]);

  return (
    <Tooltip tooltip={tooltip}>
      <center
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {imageURL ? (
          <img
            alt={imageCaption}
            src={imageURL}
            style={loading ? loadingImageStyle : styleSx.imageStyle}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {t("no_image")}
          </Box>
        )}
      </center>
      {loading && <CircularProgress sx={styleSx.circularProgressSx} />}
    </Tooltip>
  );
}
