// React
import React, { useEffect, useState } from "react";

// Design
import {
  Box,
  List,
  ListItemButton,
  Typography,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

// Internal
import PageWrapper from "../../structure/PageWrapper";
import API from "../../api";

// Third-party
import { useTranslation } from "react-i18next";

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    // bgcolor: 'red',
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  }),
};

export default function AppParameters({ pageOptions }) {
  const { t } = useTranslation();
  const [parametersData, setParametersData] = useState([]);
  const [currentText, setCurrentText] = useState({});
  const [errorInText, setErrorInText] = useState(false);
  const [waitForChange, setWaitForChange] = useState(false);
  const [selectedParam, setSelectedParam] = useState("");

  const getData = () => {
    API.get
      .appParameters()
      .then((res) => {
        setParametersData(res?.documents ?? []);
      })
      .finally(() => {});
  };

  const getDocument = (selectedParam) => {
    API.get
      .appParameterDocument({ parameterName: selectedParam })
      .then((res) => {
        setCurrentText(JSON.stringify(res?.document ?? {}, undefined, 4));
      })
      .finally(() => {});
  };

  // const handleTextChange = (event) => {
  //   setCurrentText(event.jsObject);
  //   setErrorInText(!Boolean(event.jsObject));
  // }

  const saveParam = () => {
    let _currentText = JSON.parse(currentText);
    _currentText.name = selectedParam;
    API.put
      .appParameterDocument({
        document: JSON.parse(currentText),
      })
      .then((res) => {
        getData();
        getDocument(selectedParam);
      })
      .finally(() => {});
  };

  const waitChange = () => {
    // setWaitForChange(true);
    setTimeout(() => {
      setWaitForChange(false);
    }, 3100);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedParam) {
      getDocument(selectedParam);
    } else {
      setCurrentText(JSON.stringify({}, undefined, 4));
    }
  }, [selectedParam]);

  useEffect(() => {
    if (currentText) {
      try {
        JSON.parse(currentText);
        setErrorInText(false);
      } catch (e) {
        setErrorInText(true);
      }
    }
  }, [currentText]);

  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box width={width} height={height} sx={style.mainBox}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "250px",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "30px",
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography textTransform={"uppercase"}>
                {t("documents")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "calc(100% - 30px - 60px)",
                overflowX: "hidden",
                overflowY: "auto",
              }}
            >
              {/* {JSON.stringify(Object.keys(queryData ?? {}))} */}
              <List
                sx={{
                  width: "100%",
                }}
              >
                {(parametersData ?? {}).map((parameter, index) => {
                  return (
                    <ListItemButton
                      key={index}
                      onClick={() => setSelectedParam(parameter.name)}
                      selected={selectedParam.name === parameter.name}
                    >
                      {parameter.name}
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              height: "100%",
              width: "calc(50% - 250px)",
            }}
          >
            <Box>
              <TextField
                id="outlined-basic"
                variant="outlined"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                multiline
                rows={35}
                fullWidth
                error={errorInText}
                helperText={errorInText && t("parms_must_be_json")}
                sx={{
                  backgroundColor: "black",
                }}
              />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
              }}
            >
              <Stack direction="row" justifyContent="flex-start" gap={1}>
                <Button
                  onClick={saveParam}
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={errorInText || waitForChange}
                >
                  {t("save")}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      )}
    </PageWrapper>
  );
}
