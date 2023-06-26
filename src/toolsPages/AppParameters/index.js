// React
import React, { useEffect, useState } from 'react';

// Design
import {
  Box
  , List
  , ListItemButton
  , Typography
  , Button
  , Stack
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';


// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';

// Third-party
import { useTranslation } from "react-i18next";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';


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
  const [currentText, setCurrentText] = useState({});
  const [errorInText, setErrorInText] = useState(false);
  const [waitForChange, setWaitForChange] = useState(false);
  const [selectedParam, setSelectedParam] = useState('');


  const getData = () => {
    API.get.appParameters()
      .then(res => {
        setParametersData(res?.documents ?? [])
      })
      .finally(() => {
      });
  };

  const getDocument = (selectedParam) => {
    API.get.appParameterDocument({ parameterName: selectedParam })
      .then(res => {
        setCurrentText(res?.document ?? {});
      })
      .finally(() => {
      });
  }

  const handleTextChange = (event) => {
    setCurrentText(event.jsObject);
    setErrorInText(!Boolean(event.jsObject));
  }
  console.log({ currentText })

  const saveParam = () => {
    let _currentText = currentText;
    _currentText.name = selectedParam;
    API.put.appParameterDocument({
      document: currentText,
    })
      .then(res => {
        getData();
        getDocument(selectedParam);
      })
      .finally(() => {
      });
  }

  const waitChange = () => {
    // setWaitForChange(true);
    setTimeout(() => {
      setWaitForChange(false);
    }, 3100);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedParam) {
      getDocument(selectedParam);
    }
    else {
      setCurrentText({});
    }
  }, [selectedParam])

  return (
    <PageWrapper>
      {({ width, height }) =>
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
                        onClick={() => setSelectedParam(parameter.name)}
                        selected={selectedParam.name === parameter.name}
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
            <JSONInput
              id='a_unique_id'
              placeholder={currentText}
              // colors={darktheme}
              locale={locale}
              height={'calc(100% - 50px)'}
              width={'100%'}
              waitAfterKeyPress={3000}
              style={{
                body: {
                  fontSize: '20px',
                }
              }}
              onChange={handleTextChange}
              onBlur={waitChange}
            />
            <Box
              sx={{
                flexGrow: 1,
              }}
            >
              <Stack direction='row' justifyContent='flex-start' gap={1}>
                <Button
                  onClick={saveParam}
                  variant='contained'
                  startIcon={<SaveIcon />}
                  disabled={errorInText || waitForChange}
                >
                  {t('save')}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      }
    </PageWrapper>
  )
}


