import React, { useState } from "react";

//Design
import Box from "@mui/material/Box";

//Internal
import PageWrapper from "../../structure/PageWrapper";
import EventHeader from "./components/EventHeader";
import EventAppBar from "./components/EventAppBar";
import EventMenuBox from "./components/EventMenuBox";
import EventDataBox from "./components/EventDataBox";
import { LayoutDialog } from "../../componentsStore/Dialog";
import GetSelectedStation from "../../utils/Hooks/GetSelectedStation";

// Third-party
import { useTranslation } from "react-i18next";

const style = {
  mainBox: {
    display: "flex",
    overflow: "hidden",
  },
  dataBox: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    marginLeft: 1,
    gap: 1,
  },
};

export default function Monitor({ pageOptions }) {
  const { t } = useTranslation();

  const { _id: stationId } = GetSelectedStation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemInfo, setItemInfo] = useState(null);
  const [runningItem, setRunningItem] = useState(null);
  const [dialogStartInfo, setDialogStartInfo] = useState(null);
  const [loadingSelectedItem, setLoadingSelectedItem] = useState(false);
  console.log({ itemInfo });

  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box width={width} height={height} sx={style.mainBox}>
          <Box
            sx={{
              width: pageOptions.options.eventMenuWidth,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <EventMenuBox
              width={pageOptions.options.eventMenuWidth}
              config={pageOptions.components.EventMenuBox}
              height={height}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              setItemInfo={setItemInfo}
              itemInfo={itemInfo}
              runningItem={runningItem}
              setRunningItem={setRunningItem}
              setDialogStartInfo={setDialogStartInfo}
              stationId={stationId}
              loadingSelectedItem={loadingSelectedItem}
              setLoadingSelectedItem={setLoadingSelectedItem}
            />
          </Box>
          <Box id="monitor-data-box" sx={style.dataBox}>
            <Box
              sx={{
                display: "flex",
              }}
            >
              {!loadingSelectedItem && itemInfo && (
                <>
                  <EventAppBar
                    config={pageOptions.components.EventAppBar}
                    componentsInfo={itemInfo}
                    stationId={stationId}
                  />
                  <EventHeader
                    config={pageOptions.components.EventHeader}
                    itemInfo={itemInfo}
                  />
                </>
              )}
            </Box>
            <Box
              display="flex"
              height={height - pageOptions.components.EventHeader.height}
            >
              {!loadingSelectedItem && itemInfo ? (
                <EventDataBox
                  config={pageOptions.components.EventDataBox}
                  componentsInfo={itemInfo}
                  setComponentsInfo={setItemInfo}
                  stationId={stationId}
                />
              ) : (
                loadingSelectedItem && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      width: "100%",
                      fontSize: "5rem",
                    }}
                  >
                    {t("loading")}...
                  </Box>
                )
              )}
            </Box>
          </Box>
          <LayoutDialog
            open={Boolean(dialogStartInfo)}
            // data={dialogStartInfo}
            componentsInfo={dialogStartInfo}
            onClose={() => setDialogStartInfo(null)}
            setComponentsInfo={setDialogStartInfo}
            config={pageOptions.components.EventCreateDialog}
            submitStartInfoComponentFnName={
              pageOptions.components.EventMenuBox.submitStartInfoComponentFnName
            }
            submitStartInfoComponentFnExecutor={
              pageOptions.components.EventMenuBox
                .submitStartInfoComponentFnExecutor
            }
            submitStartInfoComponent={
              pageOptions.components.EventMenuBox.submitStartInfoComponent
            }
            stationId={stationId}
          />
        </Box>
      )}
    </PageWrapper>
  );
}
