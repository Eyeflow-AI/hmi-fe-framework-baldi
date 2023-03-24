// React
import React, {useMemo} from 'react';

// Design
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import GetSelectedStation from '../../utils/Hooks/GetSelectedStation';
import updatePath from '../../utils/functions/updatePath';

// Third-party
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const styleSx = {
  mainBox: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolButton: Object.assign({}, window.app_config.style.box, {
    display: 'flex',
    flexGrow: 1,
    margin: '10px 10px 0 10px',
    width: 200,
    height: 200,
  })
};

function ToolButton ({data, onButtonClick}) {

  const { t } = useTranslation();

  const onClick = () => onButtonClick(data);

  return (
    <Box sx={styleSx.toolButton} onClick={onClick}>
      {t(data.localeId)}
    </Box>
  )
};

export default function Home({pageOptions}) {

  const station = GetSelectedStation();
  const navigate = useNavigate();

  const {pageList} = useMemo(() => {
    let pageList = [];
    for (let pageData of (pageOptions?.options?.pageList ?? [])) {
      if (window.app_config.pages.hasOwnProperty(pageData.page)) {
        pageList.push(window.app_config.pages[pageData.page]);
      }
      else {
        console.error(`Missing page ${pageData.page} in feConfig`);
      };
    };
    // let pageList = .map((page) => {window.app_config.pages[]});
    return {pageList};
  }, [pageOptions]);

  const onButtonClick = (pageData) => {
    navigate(updatePath(pageData.path, station), {state: {changeType: "click"}}); 
  };

  return (
    <>
      <Box sx={styleSx.mainBox}>
        <Grid container justifyContent={"center"} spacing={1}>
          {pageList.map((pageData, index) =>
          <Grid item key={`tool-${pageData.id}`}>
            <ToolButton data={pageData} onButtonClick={onButtonClick}/>
          </Grid> 
          )}
        </Grid>
      </Box>
    </>
  );
}
