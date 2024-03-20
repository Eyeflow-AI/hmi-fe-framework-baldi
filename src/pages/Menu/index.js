// React
import React, { useEffect, useMemo } from "react";

// Design
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// Internal
import PageWrapper from "../../structure/PageWrapper";
import GetSelectedStation from "../../utils/Hooks/GetSelectedStation";
import updatePath from "../../utils/functions/updatePath";
import ToolButton from "../../structure/ToolButton";
import { getUser } from "../../store/slices/auth";

// Third-party
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationBar } from "../../store/slices/app";

const style = {
  grid: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
  }),
};

export default function Home({ pageOptions }) {
  const dispatch = useDispatch();

  const station = GetSelectedStation();
  const navigate = useNavigate();
  const user = useSelector(getUser);

  const { pageList } = useMemo(() => {
    let pageList = [];
    const authorizationList = [];
    Object.entries(user?.tokenPayload?.payload?.accessControl).forEach(
      ([key, value]) => {
        if (value) authorizationList.push(key);
      }
    );
    for (let pageData of pageOptions?.options?.pageList ?? []) {
      let userAuthorized = authorizationList.some(
        (auth) => pageData?.acl?.includes(auth) ?? true
      );

      if (!window.app_config.pages.hasOwnProperty(pageData.page)) {
        console.error(`Missing page ${pageData.page} in feConfig`);
      } else if (!userAuthorized) {
        console.log(`User is not authorized for page ${pageData.page}`);
      } else {
        pageList.push({
          data: window.app_config.pages[pageData.page],
          icon: pageData.icon,
        });
      }
    }
    // let pageList = .map((page) => {window.app_config.pages[]});
    return { pageList };
  }, [pageOptions]);

  useEffect(() => {
    if (pageList.length === 1) {
      navigate(updatePath(pageList[0].data.path, station), {
        state: { changeType: "click" },
      });
    } else if (pageList.length === 0) {
      dispatch(
        setNotificationBar({
          show: true,
          type: "error",
          message: "no_pages_available_to_access",
        })
      );
    }
  });

  const onButtonClick = (pageData) => {
    navigate(updatePath(pageData.path, station), {
      state: { changeType: "click" },
    });
  };

  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box
          display="flex"
          justifyContent={"center"}
          alignItems={"center"}
          width={width}
          height={height}
          sx={style.grid}
        >
          <Grid
            container
            justifyContent={"center"}
            alignItems={"center"}
            spacing={4}
            width="100%"
          >
            {pageList.map((pageData, index) => (
              <Grid item key={`tool-${index}`}>
                <ToolButton pageData={pageData} onButtonClick={onButtonClick} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </PageWrapper>
  );
}
