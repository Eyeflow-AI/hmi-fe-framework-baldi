// React
import React, { useEffect, useState } from "react";

// Design
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

// Internal
import API from "../../api";

// Third-party
import { useTranslation } from "react-i18next";
import { colors } from "sdk-fe-eyeflow";

const FUNCTIONS = {
  change_password: {
    label: "change_password",
    iconNameDB: "https_24px.svg",
  },
};

const styleSx = {
  buttons: {
    backgroundColor: "white",
    border: `${colors.eyeflow.blue.dark} 1px solid`,
    "&:hover": {
      backgroundColor: "white",
    },
  },
};

export default function Menu({ setSelectedDialog, selectedDialog }) {
  const [loading, setLoading] = useState(true); // eslint-disable-line no-unused-vars
  const { t } = useTranslation();

  useEffect(() => {
    const getIconsInfo = async () => {
      // setLoading(true);
      for (let i = 0; i < Object.keys(FUNCTIONS).length; i++) {
        const funtionName = Object.keys(FUNCTIONS)[i];
        try {
          let iconInfo = await API.get.iconInfo({
            icon: FUNCTIONS[funtionName].iconNameDB,
          });
          console.log({ iconInfo });

          FUNCTIONS[
            funtionName
          ].icon = `${window.app_config.hosts["hmi-files-ws"].url}/${iconInfo.source}${iconInfo.path}`;
          console.log({ iconInfo });
        } catch (err) {
          console.log({ x: err });
        }
      }
      setLoading(false);
    };
    getIconsInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {loading ? (
        <CircularProgress size={300} />
      ) : (
        <Stack direction="row" gap={1}>
          {Object.entries(FUNCTIONS).map(([functionName, functionValue]) => {
            return (
              <Button
                variant="contained"
                onClick={() => setSelectedDialog(functionName)}
                key={`${functionName}-${functionValue.label}`}
                sx={{
                  ...styleSx.buttons,
                  backgroundColor:
                    selectedDialog === functionName
                      ? colors.eyeflow.blue.medium
                      : "white",
                  color:
                    selectedDialog !== functionName
                      ? colors.eyeflow.blue.dark
                      : "white",
                  fontSize: "1.5rem",
                  width: "200px",
                  height: "200px",
                }}
              >
                <Stack>
                  <img
                    alt=""
                    src={functionValue.icon}
                    style={{
                      height: "80px",
                    }}
                  />
                  {t(functionValue.label)}
                </Stack>
              </Button>
            );
          })}
        </Stack>
      )}
    </div>
  );
}
