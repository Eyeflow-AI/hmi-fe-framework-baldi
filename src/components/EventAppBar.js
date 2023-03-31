// React
import React, {useMemo} from 'react';


import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';


import { useTranslation } from "react-i18next";

const mainBoxSx = Object.assign(
  {},
  window.app_config.style.box,
  {
    bgcolor: 'background.paper',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexDirection: 'column',
    paddingTop: 2,
    marginRight: 1
  }
);

const style = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, {opacity: 0.8}),
  buttonImage: {
    height: 30,
    width: 30,
    filter: "invert(1)"
  }
};

export default function EventAppBar({data, config, disabled, onClickPause, onClickResume}) {

  const { t } = useTranslation();

  const {buttonList, hasAppBar} = useMemo(() => {
    let buttonList = [];
    if (data) {
      for (let buttonData of (config?.button_list ?? [])) {
        if (buttonData.id === "pause_or_resume") {
          if (data.status === "running") {
            buttonList.push({label: "pause", icon: buttonData.pause_icon, onClick: onClickPause});
          }
          else if (data.status === "paused") {
            buttonList.push({label: "resume", icon: buttonData.resume_icon, onClick: onClickResume});
          }
        }  
      };
    };

    return {
      buttonList,
      hasAppBar: buttonList.length > 0
    };
  }, [data, config, onClickPause, onClickResume]);

  if (hasAppBar) {
    return (
      <Box width={config.width} height={config.height} sx={disabled ? style.mainBoxDisabled : style.mainBox}>
        {buttonList.map((buttonProps, index) => 
        <Tooltip key={index} title={t(buttonProps.label)}>
          <IconButton onClick={buttonProps.onClick}>
            <img alt="" src={buttonProps.icon} style={style.buttonImage} />
          </IconButton>
        </Tooltip>
        )}
      </Box>
    )
  }
  else {
    return null;
  };
};