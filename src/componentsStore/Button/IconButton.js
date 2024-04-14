// React
import React from "react";

// Design
import MUIIconButton from "@mui/material/IconButton";

// Internal
import Tooltip from "../Wrapper/Tooltip";
import { setNotificationBar } from "../../store/slices/app";
import eventsHandler from "../../utils/functions/eventsHandler";

// Third-party
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  console.log({ component, IconButtonbuttonData: tooltip });

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
    eventsHandler({
      componentsInfo,
      item: component,
      fnExecutor: "",
      fnName,
      stationId,
      handleNotificationBar,
    });
  };

  return (
    <Tooltip tooltip={tooltip}>
      <MUIIconButton
        onClick={handleClick}
        // disabled={buttonProps.disabled}
      >
        <img
          alt=""
          src={icon}
          style={Object.assign({}, style.buttonImage, {
            // opacity: buttonProps.disabled ? 0.3 : 1,
          })}
        />
      </MUIIconButton>
    </Tooltip>
  );
}
