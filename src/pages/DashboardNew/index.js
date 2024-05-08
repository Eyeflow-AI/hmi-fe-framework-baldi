import React, { useState } from "react";

//Design
import Box from "@mui/material/Box";

//Internal
import PageWrapper from "../../structure/PageWrapper";
import EventDataBox from "./components/EventDataBox";
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
  const [loadingSelectedItem, setLoadingSelectedItem] = useState(false);
  console.log({ itemInfo, pageOptions });

  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box width={width} height={height} sx={style.mainBox}>
          <Box id="monitor-data-box" sx={style.dataBox}>
            <Box display="flex" height={height}>
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
        </Box>
      )}
    </PageWrapper>
  );
}
