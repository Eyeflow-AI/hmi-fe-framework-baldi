// React
import React, {useMemo} from 'react';


import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslation } from "react-i18next";

const mainBoxSx = Object.assign(
  {},
  window.app_config.style.box,
  {
    bgcolor: 'background.paper',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    flexDirection: 'column',
    paddingTop: 2,
    marginRight: 1,
  }
);

const style = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, {opacity: 0.8}),
  buttonImage: {
    height: 30,
    width: 30,
    filter: "invert(1)"
  },
  buttonBox: {
    position: 'relative',
    // border: "1px solid #ccc",
  },
  circularProgress: {
    position: 'absolute',
    top: "8px",
    left: "8px",
    zIndex: 1,
  }
};

export default function EventAppBar({isBatchRunning, data, config, disabled, onClickPause, onClickResume, resumeLoading, pauseLoading}) {

  const { t } = useTranslation();

  const {buttonList, hasAppBar} = useMemo(() => {
    let buttonList = [];
    if (data) {
      for (let buttonData of (config?.button_list ?? [])) {
        if (buttonData.id === "pause_or_resume") {
          if (data.status === "running") {
            buttonList.push({label: "pause", icon: buttonData.pause_icon, onClick: onClickPause, disabled: pauseLoading, loading: pauseLoading});
          }
          else if (data.status === "paused") {
            buttonList.push({label: "resume", icon: buttonData.resume_icon, onClick: onClickResume, disabled: isBatchRunning || resumeLoading, loading: resumeLoading});
          }
        }  
      };
    };

    return {
      buttonList,
      hasAppBar: buttonList.length > 0
    };
  }, [isBatchRunning, data, config, onClickPause, onClickResume, pauseLoading, resumeLoading]);

  if (hasAppBar) {
    return (
      <Box width={config.width} height={config.height} sx={disabled ? style.mainBoxDisabled : style.mainBox}>
        {buttonList.map((buttonProps, index) => 
        <Box sx={style.buttonBox}>
          <Tooltip key={index} title={t(buttonProps.label)}>
            <IconButton onClick={buttonProps.onClick} disabled={buttonProps.disabled}>
              <img alt="" src={buttonProps.icon} style={Object.assign({}, style.buttonImage, {opacity: buttonProps.disabled ? 0.3 : 1})} />
            </IconButton>
          </Tooltip>
          {buttonProps.loading && <CircularProgress style={style.circularProgress} size={30} thickness={5} color="inherit" disableShrink={true}/>}
        </Box>
        )}
      </Box>
    )
  }
  else {
    return null;
  };
};