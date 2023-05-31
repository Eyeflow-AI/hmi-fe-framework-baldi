// React
import React, { useEffect, useState } from 'react';

// Design
import { Box, List, Typography, ListItemButton } from '@mui/material';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';

// Third-party
import { useTranslation } from "react-i18next";


const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: 'background.paper',
    // bgcolor: 'red',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }),
};



export default function ChecklistConnector({ pageOptions }) {

  const { t } = useTranslation();
  const [parametersData, setParametersData] = useState([]);


  const getData = () => {
    API.get.appParameters()
      .then(res => {
        console.log({ res })
        setParametersData(res?.documents ?? [])
      })
      .finally(() => {
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageWrapper>
      {(width, height) =>
        <Box
          width={width}
          height={height}
          sx={style.mainBox}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '250px',
              height: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '30px',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography textTransform={'uppercase'}>
                {t('documents')}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: 'calc(100% - 30px - 60px)',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              {/* {JSON.stringify(Object.keys(queryData ?? {}))} */}
              <List
                sx={{
                  width: '100%',
                }}
              >
                {
                  (parametersData ?? {}).map((parameter, index) => {
                    return (
                      <ListItemButton
                        key={index}
                      // onClick={() => setSelectedQuery(queryName)}
                      // selected={selectedQuery === queryName}
                      >
                        {parameter.name}
                      </ListItemButton>
                    )
                  })
                }
              </List>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: '100%',
              width: 'calc(50% - 250px)',
            }}
          >
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              height: '100%',
              width: 'calc(50% - 250px)',
            }}
          >
          </Box>
        </Box>
      }
    </PageWrapper>
  )
}


