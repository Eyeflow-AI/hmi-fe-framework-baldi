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
import DownloadIcon from "@mui/icons-material/Download";
// Internal
import PageWrapper from "../../structure/PageWrapper";
import API from "../../api";

// Third-party
import { useTranslation } from "react-i18next";
import AceEditor from "react-ace";
import { downloadJsonData } from "sdk-fe-eyeflow";

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
      <DialogTitle>{oldName ? "Rename Script" : "Create Script"}</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            id="scriptName"
            label="Script Name"
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

export default function Scripts({ pageOptions }) {
  const { t } = useTranslation();
  const [scriptData, setScriptData] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [selectedScript, setSelectedScript] = useState("");
  const [createScriptDialogOpen, setCreateScriptDialogOpen] = useState("");

  const getData = () => {
    API.get
      .scripts()
      .then((res) => {
        setScriptData(res?.documents ?? []);
      })
      .finally(() => {});
  };

  const getDocument = (selectedScript) => {
    API.get
      .scriptDocument({ name: selectedScript })
      .then((res) => {
        // console.log({ res });
        setCurrentText(res?.document?.document ?? "");
      })
      .finally(() => {});
  };

  const saveScript = () => {
    let document = {
      name: selectedScript,
      document: currentText,
    };
    API.put
      .script({
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
      .script({ name })
      .then((res) => {})
      .catch(console.error)
      .finally(() => {
        getData();
        setSelectedScript("");
        setCurrentText("");
      });
  };

  const editScriptName = ({ name, oldName }) => {
    API.put
      .scriptName({ name, oldName })
      .then((res) => {})
      .catch(console.error)
      .finally(() => {
        getData();
        setSelectedScript(name);
      });
  };

  const createScript = ({ name }) => {
    API.post
      .script({ name })
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
  // console.log({ createScriptDialogOpen });

  function handleDownloadAllScripts() {
    API.get.downloadAllScripts().then((res) => {
      let documents = res?.documents ?? [];
      documents.forEach((doc) => {
        downloadJsonData(doc, `script_${doc.name}`);
      });
    });
  }

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
                {t("scripts")}
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
                <Tooltip title={t("create_script")}>
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
                <Tooltip title={t("download_all_scripts")}>
                  <ListItemButton
                    key="donwloadScriptsButton"
                    // onClick={() => setSelectedScript(script.name)}
                    // selected={selectedScript.name === script.name}
                    onClick={handleDownloadAllScripts}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DownloadIcon />
                  </ListItemButton>
                </Tooltip>
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
              <AceEditor
                mode="javascript"
                theme="monokai"
                onChange={onChange}
                name="codeEditor"
                editorProps={{ $blockScrolling: true }}
                height="calc(100vh - 100px)"
                width="calc(100% - 275px)"
                fontSize={24}
                value={currentText}
                placeholder="Start your script"
                highlightActiveLine={true}
                enableLiveAutocompletion={true}
              />
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                width: "calc(100% - 275px)",
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
                  disabled={!currentText && !selectedScript}
                  color="success"
                >
                  {t("save")}
                </Button>
              </Stack>
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
