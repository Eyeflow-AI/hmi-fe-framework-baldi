// React
import React, { useState } from "react";

// Design
import MUIIconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

// Internal
import Tooltip from "../Wrapper/Tooltip";
import { setNotificationBar } from "../../store/slices/app";
import eventsHandler from "../../utils/functions/eventsHandler";

// Third-party
import { useDispatch } from "react-redux";

const style = {
  buttonImage: {
    height: 30,
    width: 30,
    filter: "invert(1)",
  },
  buttonBox: {
    position: "relative",
    // border: "1px solid #ccc",
  },
  circularProgress: {
    position: "absolute",
    top: "8px",
    left: "8px",
    zIndex: 1,
  },
};

export default function IconButton({
  component,
  icon,
  tooltip,
  componentsInfo,
  stationId,
  fnName,
}) {
  const dispatch = useDispatch();
  // console.log({ component, IconButtonbuttonData: tooltip });
  const [loading, setLoading] = useState(false);

  const handleNotificationBar = (message, severity) => {
    dispatch(
      setNotificationBar({
        show: true,
        type: severity,
        message: message,
      })
    );
  };

  const handleClick = () => {
    setLoading(true);
    eventsHandler({
      componentsInfo,
      item: component,
      fnExecutor: "",
      fnName,
      stationId,
      handleNotificationBar,
      setLoading,
    });
  };

  return (
    <Tooltip tooltip={tooltip}>
      <>
        <MUIIconButton onClick={handleClick} disabled={loading}>
          <img
            alt=""
            src={icon}
            style={Object.assign({}, style.buttonImage, {
              // opacity: buttonProps.disabled ? 0.3 : 1,
            })}
          />
        </MUIIconButton>
        {loading && (
          <CircularProgress
            style={style.circularProgress}
            size={30}
            thickness={5}
            color="inherit"
            disableShrink={true}
          />
        )}
      </>
    </Tooltip>
  );
}
