// React
import React, { useEffect, useState } from 'react';

// Design
import { Box, Button, Typography } from '@mui/material';
import SchemaIcon from '@mui/icons-material/Schema';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';

// Internal
import PageWrapper from '../../components/PageWrapper';
import API from '../../api';
import List from '../../components/List';
import ChecklistReferenceSchemaDialog from './checklistReferenceSchemaDialog';
import ChecklistReferencesTable from './checklistReferencesTable';

// Third-party
import { useTranslation } from 'react-i18next';

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
  const [checklistReferences, setChecklisReferences] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemRegions, setSelectedItemRegions] = useState(null);
  const [selectedItemRegion, setSelectedItemRegion] = useState(null);
  const [schemaDocument, setSchemaDocument] = useState(null);
  const [schemaDialogOpen, setSchemaDialogOpen] = useState(false);
  const [currentReference, setCurrentReference] = useState({});
  const [referenceToSave, setReferenceToSave] = useState({});


  const getSchemaData = () => {
    API.get.checklistSchemas()
      .then(res => {
        setSchemaDocument(res?.document ?? null);
        return res?.document ?? null;
      })
      .finally(() => {
      });
  };

  const saveReference = () => {
    // console.log({ referenceToSave, _id: selectedItem.id });
    API.put.checklistReference({ _id: selectedItem.id, reference: referenceToSave })
      .then(res => {
        // console.log({ res });
      })
      .finally(() => {
      });

  }


  const getData = () => {
    API.get.checklistReferences()
      .then(async (res) => {
        if (res?.documents?.length > 0) {
          let schemas = getSchemaData();
          let _documents = res.documents.map((el) => {
            let currentSchema = schemas?.custom?.find((schema) => String(schema.id) === String(el._id));
            return {
              id: el._id,
              imageName: `${el._id}.jpg`,
              schema: currentSchema?.schema ?? null,
            }
          });
          setChecklisReferences(_documents);
        }
        else {
          setChecklisReferences([])
        }
      })
      .finally(() => {
      });
  };

  const getChecklistRegions = (id) => {
    API.get.checklistRegions(id)
      .then(res => {
        setSelectedItemRegions(res?.checklist ?? null)
      })
      .finally(() => {
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (pageOptions?.options?.imageURL) {
      setImageURL(pageOptions?.options?.imageURL);
    }
  }, [pageOptions]);

  useEffect(() => {
    if (selectedItem) {
      getChecklistRegions(selectedItem.id);
      setSelectedItemRegion(null);
      setCurrentReference(selectedItem?.reference ?? {});
    }
    else {
      setSelectedItemRegion(null);
      setSelectedItemRegions(null);
      setCurrentReference({});
    }
  }, [selectedItem]);



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
              justifyContent: 'center',
              alignItems: 'center',
              width: '450px',
              height: '100%',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100px',
              }}
            >
              <Button
                startIcon={<SchemaIcon />}
                variant="contained"
                color="primary"
                size="large"
                disabled={!schemaDocument?.default_schema}
                onClick={() => { setSchemaDialogOpen(true) }}
              >
                {t('checklist_references_schema')}
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: 'calc(100% - 100px)',
              }}
            >
              <List
                width='420px'
                height='100%'
                itemHeight={280}
                itemsList={checklistReferences}
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
                imageURL={imageURL}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: 'calc(100% - 400px)',
              height: '100%',
              // border: '1px solid white',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: 'calc(100%)',
                height: 'calc(100% - 300px)',
                // border: '1px solid red',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {
                selectedItem &&
                <img
                  src={`${imageURL}/${selectedItem.imageName}`}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    // border: '1px solid red',
                  }}
                />
              }
              {
                selectedItemRegions?.checkList?.map((el, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        position: 'absolute',
                        left: `calc(${el?.region?.bbox?.p1[0]} * 100%)`,
                        top: `calc(${el?.region?.bbox?.p1[1]} * 100%)`,
                        width: `calc(${el?.region?.bbox?.p2[0]} * 100% - ${el?.region?.bbox?.p1[0]} * 100%)`,
                        height: `calc(${el?.region?.bbox?.p2[1]} * 100% - ${el?.region?.bbox?.p1[1]} * 100%)`,
                        border: `1px solid ${el?.region?.color}`,
                        backgroundColor: selectedItemRegion?.index === index ? `${el?.region?.color}80` : `${el?.region?.color}60`,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onClick={() => {
                        setSelectedItemRegion({
                          region: el,
                          index: index,
                        });
                      }}
                    >
                      <Typography
                        textAlign={'left'}
                        sx={{
                          fontSize: '2rem',
                          backgroundColor: selectedItemRegion?.index === index ? '#000000' : '#00000070',
                        }}
                      >
                        {el?.region?.name}
                      </Typography>
                    </Box>
                  )
                })
              }

            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '300px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '50%',
                  height: '100%',
                }}
              >
                {
                  selectedItemRegions &&
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <ChecklistReferencesTable
                      schemaDocument={schemaDocument}
                      selectedItem={selectedItemRegions}
                      referenceToSave={referenceToSave}
                      setReferenceToSave={setReferenceToSave}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100px',
                      }}
                    >
                      <Button
                        startIcon={<SaveIcon />}
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={JSON.stringify(currentReference) === JSON.stringify(referenceToSave)}
                        onClick={saveReference}
                      >
                        {t('save')}
                      </Button>
                    </Box>
                  </Box>
                }
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '50%',
                  height: '300px',
                  overflow: 'hidden',
                  // marginTop: '200px'
                }}
              >
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={JSON.stringify(selectedItemRegions?.checkList ?? {}, undefined, 4)}
                  // onChange={(e) => setCurrentText(e.target.value)}
                  disabled
                  multiline
                  rows={12}
                  fullWidth
                  sx={{
                    backgroundColor: 'black',
                  }}
                />
              </Box>
            </Box>
          </Box>
          <ChecklistReferenceSchemaDialog
            open={schemaDialogOpen}
            setOpen={setSchemaDialogOpen}
            schema={schemaDocument?.default_schema}
            getSchemaData={getSchemaData}
          />
        </Box>
      }
    </PageWrapper>
  )
}


