import React, { useEffect, useRef, useState } from "react";

//Design
import Box from "@mui/material/Box";

//Internal
import PageWrapper from "../../structure/PageWrapper";
import EventHeader from "./components/EventHeader";
import EventAppBar from "./components/EventAppBar";
import EventMenuBox from "./components/EventMenuBox";
// import EventSerialDataBox from "../../components/EventSerialDataBox";
import EventDataBox from "./components/EventDataBox";
import GetSerialList from "../../utils/Hooks/GetSerialList";
import GetRunningSerial from "../../utils/Hooks/GetRunningSerial";

import GetSelectedStation from "../../utils/Hooks/GetSelectedStation";
import API from "../../api";

import { monitorSlice } from "../../store/slices/monitor";

// Third-party
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch();
  const state = useSelector((state) => state.monitor);

  useEffect(() => {
    return () => {
      dispatch(monitorSlice.actions.setInitialState());
    };
  }, []);

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
            />
          </Box>
          <Box id="monitor-data-box" sx={style.dataBox}>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <EventAppBar config={pageOptions.components.EventAppBar} />
              <EventHeader config={pageOptions.components.EventHeader} />
            </Box>
            <Box
              display="flex"
              height={height - pageOptions.components.EventHeader.height}
            >
              <EventDataBox config={pageOptions.components.EventDataBox} />
            </Box>
          </Box>
        </Box>
      )}
    </PageWrapper>
  );
}
