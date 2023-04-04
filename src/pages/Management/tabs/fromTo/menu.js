// React
import React, { useEffect, useState } from "react";

// Design
import { Button, Stack } from "@mui/material";
import { CircularProgress } from '@mui/material';


// Internal
import API from "../../../../api";

// Third-party
import { useTranslation } from "react-i18next";
import { colors } from "sdk-fe-eyeflow";

const VIEWS = {
  datasets: {
    label: 'datasets',
    iconNameDB: 'dataset_24px.svg',
  },
  classes: {
    label: 'classes',
    iconNameDB: 'class_24px.svg',
  },
};

const styleSx = {
  buttons: {
    backgroundColor: 'white',
    border: `${colors.eyeflow.blue.dark} 1px solid`,
    '&:hover': {
      backgroundColor: 'white',
    }
  }
};


export default function Menu({
  setSelectedView,
  selectedView,
  loading,
  setLoading,
}) {

  const { t } = useTranslation();



  useEffect(() => {
    const getIconsInfo = async () => {

      setLoading(true);
      for (let i = 0; i < Object.keys(VIEWS).length; i++) {
        const viewName = Object.keys(VIEWS)[i];
        try {
          let iconInfo = await API.get.iconInfo({ icon: VIEWS[viewName].iconNameDB });
          VIEWS[viewName].icon = `${window.app_config.hosts['hmi-files-ws'].url}/${iconInfo.source}${iconInfo.path}`;
        }
        catch (err) {
          console.log({ err })
        }
      };
      setLoading(false);
    }
    getIconsInfo();
  }, []);

  return (
    <>
      {
        selectedView ?
          <Stack direction='row' gap={1}>
            {
              Object.entries(VIEWS).map(([viewName, viewValue]) => (
                <Button
                  onClick={() => setSelectedView(viewName)}
                  key={`${viewName}-${viewValue.label}`}
                  sx={{
                    ...styleSx.buttons,
                    backgroundColor: selectedView === viewName ? colors.eyeflow.blue.medium : "white",
                    color: selectedView !== viewName ? colors.eyeflow.blue.dark : "white"
                  }}
                >
                  {t(viewValue.label)}
                </Button>
              ))
            }
          </Stack>
          :
          (
            loading ?
              <CircularProgress
                size={300}
              />
              :

              <Stack direction='row' gap={1}>
                {
                  Object.entries(VIEWS).map(([viewName, viewValue]) => (
                    <Button
                      variant="contained"
                      onClick={() => setSelectedView(viewName)}
                      key={`${viewName}-${viewValue.label}`}
                      sx={{
                        ...styleSx.buttons,
                        backgroundColor: selectedView === viewName ? colors.eyeflow.blue.medium : "white",
                        color: selectedView !== viewName ? colors.eyeflow.blue.dark : "white",
                        fontSize: '1.5rem',
                        width: '200px',
                        height: '200px',
                      }}
                    >
                      <Stack>
                        <img
                          alt=""
                          src={viewValue.icon}
                          style={{
                            height: '80px'
                          }}
                        />
                        {t(viewValue.label)}
                      </Stack>
                    </Button>
                  ))
                }
              </Stack>
          )
      }
    </>

  );
}