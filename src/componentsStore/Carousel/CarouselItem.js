// React
import React from "react";

//Design
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

//Internal
import "../../css/animateFlicker.css";
import Tooltip from "../Wrapper/Tooltip";

//Third-party
import { useTranslation } from "react-i18next";
import { colors } from "sdk-fe-eyeflow";
import dateFormat from "sdk-fe-eyeflow/functions/dateFormat";

const style = {
  itemSx: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: 2,
    width: "100%",
    height: "100%",
    borderRadius: 1,
    cursor: "pointer",
    color: "white",
    textShadow: "1px 1px 2px #404040",
    "&:hover": {
      boxShadow: (theme) => `${theme.shadows[3]}, inset 0 0 0 2px black`,
    },
  },
  itemHeader: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    paddingLeft: 1,
    paddingRight: 1,
  },
  itemImageBox: {
    marginTop: -1,
  },
  itemImage: {
    height: 70,
    maxWidth: "calc(100% - 10px)",
    // filter: "invert(1)",
  },
  itemFooter: {
    paddingBottom: 0.2,
  },
};

style.selectedItemSx = Object.assign({}, style.itemSx, {
  boxShadow: (theme) => `${theme.shadows[2]}, inset 0 0 0 2px black`,
});

export default function CarouselItem({
  data,
  selected,
  onClick,
  conveyorIcon,
  setComponentsInfo,
}) {
  const { t } = useTranslation();

  let index = data?.index ?? "";
  let imageURL = data?.imageURL ?? conveyorIcon;
  let imageCaption = data?.imageCaption ?? "";
  let imageStyle = Boolean(data?.thumbStyle)
    ? data.thumbStyle
    : style.itemImage;
  let status = data?.status ?? "";
  let timestamp = Boolean(data?.timestamp) ? dateFormat(data?.timestamp) : "";
  let tooltip = data?.tooltip ?? null;
  let label = data?.label ?? "";
  let backgroundColor =
    data?.backgroundColor && data?.backgroundColor !== ""
      ? data?.backgroundColor
      : colors.statuses[status];

  let boxStyle = Object.assign(
    {
      backgroundColor: selected ? backgroundColor : `${backgroundColor}90`,
    },
    selected ? style.selectedItemSx : style.itemSx
  );

  return (
    <Tooltip tooltip={tooltip}>
      <Box sx={boxStyle} onClick={onClick}>
        <Box sx={style.itemHeader}>
          <Box>
            <Typography variant="h6">{index}</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="end">
            <Box marginBottom={-1}>
              <Typography variant="subtitle1">{label}</Typography>
            </Box>
            <Box
              className={status === "running" ? "animate-flicker" : undefined}
            >
              <Typography variant="subtitle2">{t(status)}</Typography>
            </Box>
          </Box>
        </Box>

        {imageURL && (
          <Box sx={style.itemImageBox}>
            <center>
              <img alt={imageCaption} src={imageURL} style={imageStyle} />
            </center>
          </Box>
        )}

        <Box sx={style.itemFooter}>
          <Typography variant="subtitle2">{timestamp}</Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}
