// React
import React, { useMemo } from 'react';

// Design
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// Internal
import PageWrapper from '../../components/PageWrapper';
import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import updatePath from '../../utils/functions/updatePath';
import ToolButton from '../../components/ToolButton';
import { getUser } from '../../store/slices/auth';

// Third-party
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';


const style = {
  grid: Object.assign({}, window.app_config.style.box, { bgcolor: "background.paper" }),
};

export default function Home({ pageOptions }) {

  const station = GetSelectedStation();
  const navigate = useNavigate();
  const user = useSelector(getUser);

  const { pageList } = useMemo(() => {
    let pageList = [];
    const authorizationList = [];
    Object.entries(user?.tokenPayload?.payload?.accessControl).forEach(([key, value]) => { if (value) authorizationList.push(key); });

    for (let pageData of (pageOptions?.options?.pageList ?? [])) {
      let showPage = authorizationList.some((auth) => pageData?.acl?.includes(auth) ?? true);
      if (window.app_config.pages.hasOwnProperty(pageData.page) && showPage) {
        pageList.push({ data: window.app_config.pages[pageData.page], icon: pageData.icon });
      }
      else {
        console.error(`Missing page ${pageData.page} in feConfig`);
      };
    };
    // let pageList = .map((page) => {window.app_config.pages[]});
    return { pageList };
  }, [pageOptions]);

  const onButtonClick = (pageData) => {
    navigate(updatePath(pageData.path, station), { state: { changeType: "click" } });
  };

  return (
    <PageWrapper>
      {({ width, height }) =>
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
            {pageList.map((pageData, index) =>
              <Grid item key={`tool-${index}`}>
                <ToolButton pageData={pageData} onButtonClick={onButtonClick} />
              </Grid>
            )}
          </Grid>
        </Box>
      }
    </PageWrapper>
  );
}
