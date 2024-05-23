// React
import React, { useEffect, useState } from "react";

// Design
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
// import DownloadIcon from "@mui/icons-material/Download";
// Internal
import PageWrapper from "../../structure/PageWrapper";
import API from "../../api";

// Third-party
import { useTranslation } from "react-i18next";
import AceEditor from "react-ace";
// import { downloadJsonData } from "sdk-fe-eyeflow";

// import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
// import "ace-builds/src-noconflict/ext-searchbox";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

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

function CreateScriptDialog({
  open,
  handleClose,
  createScript,
  oldName = "",
  scriptsNames = [],
}) {
  const [scriptName, setScriptName] = useState(oldName);

  useEffect(() => {
    setScriptName(oldName);
  }, [oldName]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {oldName ? "Rename Query Pipeline" : "Create Query Pipeline"}
      </DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            id="scriptName"
            label="Query Pipeline Name"
            variant="outlined"
            value={scriptName}
            onChange={(e) => setScriptName(e.target.value)}
            sx={{
              margin: "10px",
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            createScript({ name: scriptName, oldName });
            handleClose();
          }}
          disabled={!scriptName || scriptsNames.includes(scriptName)}
        >
          {oldName ? "Rename" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function QueriesPipelines({ pageOptions }) {
  const { t } = useTranslation();
  const [scriptData, setScriptData] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [selectedScript, setSelectedScript] = useState("");
  const [createScriptDialogOpen, setCreateScriptDialogOpen] = useState("");
  const [errorInGeneralText, setErrorInGeneralText] = useState(false);
  const [currentGeneralText, setCurrentGeneralText] = useState("{}");
  const [currentChartInfoText, setCurrentChartInfoText] = useState("{}");
  const [errorInChartInfoText, setErrorInChartInfoText] = useState(false);
  const [currentPipelineText, setCurrentPipelineText] = useState("{}");
  const [errorInPipelineText, setErrorInPipelineText] = useState(false);

  const getData = () => {
    API.get
      .queriesPipeline()
      .then((res) => {
        setScriptData(res?.documents ?? []);
      })
      .finally(() => {});
  };

  const getDocument = (selectedScript) => {
    API.get
      .queriesPipelineDocument({ name: selectedScript })
      .then((res) => {
        const notGeneralKeys = ["chart", "pipeline", "functions"];
        setCurrentText(res?.document?.functions?.post_function ?? "");
        setCurrentGeneralText(
          JSON.stringify(
            Object.fromEntries(
              Object.entries(res?.document ?? {}).filter(
                ([key]) => !notGeneralKeys.includes(key)
              )
            ),
            undefined,
            4
          )
        );
        setCurrentChartInfoText(
          JSON.stringify(res?.document?.chart ?? {}, undefined, 4)
        );
        setCurrentPipelineText(
          JSON.stringify(res?.document?.pipeline ?? {}, undefined, 4)
        );
      })
      .finally(() => {});
  };

  const saveScript = () => {
    let document = {
      name: selectedScript,
      document: {
        functions: {
          post_function: currentText,
        },
        ...JSON.parse(currentGeneralText),
        chart: JSON.parse(currentChartInfoText),
        pipeline: JSON.parse(currentPipelineText),
      },
    };
    if (currentText) {
    }
    API.put
      .queryPipelines({
        document,
      })
      .then((res) => {
        getData();
        getDocument(selectedScript);
      })
      .finally(() => {});
  };

  const deleteScript = ({ name }) => {
    API.delete
      .queryPipelines({ name })
      .then((res) => {})
      .catch(console.error)
      .finally(() => {
        getData();
        setSelectedScript("");
        setCurrentText("");
        setCurrentGeneralText("{}");
        setCurrentChartInfoText("{}");
        setCurrentPipelineText("{}");
      });
  };

  const editScriptName = ({ name, oldName }) => {
    API.put
      .queryPipelinesName({ name, oldName })
      .then((res) => {})
      .catch(console.error)
      .finally(() => {
        getData();
        setSelectedScript(name);
      });
  };

  const createScript = ({ name }) => {
    API.post
      .queryPipeline({ name })
      .then((res) => {})
      .catch(console.error)
      .finally(() => {
        getData();
        setSelectedScript(name);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedScript) {
      // console.log({ selectedScript });
      getDocument(selectedScript);
    } else {
      // setCurrentText(JSON.stringify({}, undefined, 4));
    }
  }, [selectedScript]);

  function onChange(newValue) {
    // console.log("change", newValue);
    setCurrentText(newValue);
  }

  useEffect(() => {
    if (currentGeneralText) {
      try {
        JSON.parse(currentGeneralText);
        setErrorInGeneralText(false);
      } catch (e) {
        setErrorInGeneralText(true);
      }
    }
  }, [currentGeneralText]);

  useEffect(() => {
    if (currentChartInfoText) {
      try {
        JSON.parse(currentChartInfoText);
        setErrorInChartInfoText(false);
      } catch (e) {
        setErrorInChartInfoText(true);
      }
    }
  }, [currentChartInfoText]);

  useEffect(() => {
    if (currentPipelineText) {
      try {
        JSON.parse(currentPipelineText);
        setErrorInPipelineText(false);
      } catch (e) {
        setErrorInPipelineText(true);
      }
    }
  }, [currentPipelineText]);

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
                {t("queries_pipelines")}
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
                <Tooltip title={t("create_query_pipeline")}>
                  <ListItemButton
                    key="createScriptButton"
                    // onClick={() => setSelectedScript(script.name)}
                    // selected={selectedScript.name === script.name}
                    onClick={() => setCreateScriptDialogOpen("create")}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AddIcon />
                  </ListItemButton>
                </Tooltip>
                {(scriptData ?? {}).map((script, index) => {
                  return (
                    <ListItemButton
                      key={index}
                      onClick={() => setSelectedScript(script.name)}
                      selected={selectedScript === script.name}
                    >
                      {script.name}
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
              height: "100%",
              width: "calc(50% - 250px)",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                height: "calc(100% - 30px - 60px)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  height: "100%",
                }}
              >
                <Typography>{t("general")}</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={currentGeneralText}
                  onChange={(e) => setCurrentGeneralText(e.target.value)}
                  multiline
                  rows={20}
                  fullWidth
                  error={errorInGeneralText}
                  helperText={errorInGeneralText && t("parms_must_be_json")}
                  sx={{
                    backgroundColor: "black",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  flexGrow: 1,
                }}
              >
                <Typography>{t("chart_info")}</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={currentChartInfoText}
                  onChange={(e) => setCurrentChartInfoText(e.target.value)}
                  multiline
                  rows={10}
                  fullWidth
                  error={errorInChartInfoText}
                  helperText={errorInChartInfoText && t("parms_must_be_json")}
                  sx={{
                    backgroundColor: "black",
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexGrow: 1,
                height: "100%",
                width: "calc(70%)",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  height: "100%",
                  width: "calc(40%)",
                }}
              >
                <Typography>{t("pipeline")}</Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={currentPipelineText}
                  onChange={(e) => setCurrentPipelineText(e.target.value)}
                  multiline
                  rows={33}
                  fullWidth
                  error={errorInPipelineText}
                  helperText={errorInPipelineText && t("parms_must_be_json")}
                  sx={{
                    backgroundColor: "black",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  height: "100%",
                  width: "calc(60%)",
                }}
              >
                <Typography>{t("post_function")}</Typography>
                <AceEditor
                  mode="javascript"
                  theme="monokai"
                  onChange={onChange}
                  name="codeEditor"
                  editorProps={{ $blockScrolling: true }}
                  height="calc(100vh - 142px)"
                  width="calc(100% )"
                  fontSize={24}
                  value={currentText}
                  placeholder="Start your script"
                  highlightActiveLine={true}
                  enableLiveAutocompletion={true}
                />

                <Box
                  sx={{
                    flexGrow: 1,
                    width: "calc(100%)",
                  }}
                >
                  <Stack direction="row" justifyContent="flex-end" gap={1}>
                    <Button
                      onClick={() => deleteScript({ name: selectedScript })}
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      disabled={!selectedScript}
                      color="error"
                    >
                      {t("delete")}
                    </Button>
                    <Button
                      onClick={() => setCreateScriptDialogOpen("edit")}
                      variant="contained"
                      startIcon={<EditIcon />}
                      disabled={!selectedScript}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      onClick={saveScript}
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={
                        errorInGeneralText ||
                        errorInChartInfoText ||
                        errorInPipelineText
                      }
                      color="success"
                    >
                      {t("save")}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>
          <CreateScriptDialog
            open={createScriptDialogOpen}
            handleClose={() => setCreateScriptDialogOpen("")}
            createScript={
              createScriptDialogOpen === "create"
                ? createScript
                : editScriptName
            }
            oldName={createScriptDialogOpen === "create" ? "" : selectedScript}
            scriptsNames={scriptData.map((script) => script.name)}
          />
        </Box>
      )}
    </PageWrapper>
  );
}
