// React
import React, { useEffect, useState } from "react";

// Design
import MUIIconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

// Internal
import Tooltip from "../Wrapper/Tooltip";
import { setNotificationBar, setDialog } from "../../../store/slices/app";
import eventsHandler from "../../../utils/functions/eventsHandler";

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
  tag, 
  name
}) {
  const dispatch = useDispatch();
  // console.log({ component, IconButtonbuttonData: tooltip });
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (
      componentsInfo &&
      typeof componentsInfo === "object" &&
      Object.keys(componentsInfo).length > 0
    ) {
      const component = componentsInfo?.find(
        (item) => item?.tag === tag && item?.name === name
      ) ?? {};
      console.log({component, componentsInfo, tag, name});
      setItem(component);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

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
    if (item?.on?.click === "openDialog") {
      setLoading(false);
      dispatch(
        setDialog({
          show: true,
          title: 'dri'
        })
      );
    } else {
      eventsHandler({
        componentsInfo,
        item: component,
        fnExecutor: "",
        fnName,
        stationId,
        handleNotificationBar,
        setLoading,
      });
    }
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
