// React
import React, { useState, useEffect } from 'react';

// Design
import {
  Dialog
  , DialogTitle
  , DialogContent
  , TableContainer
  , Table
  , TableHead
  , TableBody
  , TableRow
  , TableCell
  , Paper
  , IconButton
  , Tooltip
  , FormControl
  , InputLabel
  , Select
  , MenuItem
  , TextField
  , DialogActions
  , Button
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';

// Internal
import API from '../../api';


// Third-party
import { useTranslation } from 'react-i18next';


function AddReferenceDialog({ open, setOpen, schema }) {

  const { t } = useTranslation();


  const [selectedType, setSelectedType] = useState('');
  const [referenceNameError, setReferenceNameError] = useState(false);
  const [referenceName, setReferenceName] = useState('');


  const handleTypeSelection = (event) => {
    setSelectedType(event.target.value);
  }

  const handleReferenceNameChange = (event) => {
    let value = event.target.value;
    setReferenceName(value);
    if (Object.keys(schema?.[selectedType] ?? {}).includes(value)) {
      setReferenceNameError(true);
    }
    else {
      setReferenceNameError(false);
    }
  }

  const handleAddReference = () => {
    API.put.referenceToSchema({ referenceName, referenceType: selectedType })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setOpen(false);
      })
  }

  useEffect(() => {
    if (open) {
      setSelectedType('');
      setReferenceName('');
      setReferenceNameError(false);
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle>
        {t('add_reference')}
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl
          sx={{
            marginTop: 2,
          }}
          fullWidth
        >
          <InputLabel id="demo-simple-select-label">{t("reference_type")}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedType}
            label={t("reference_type")}
            onChange={handleTypeSelection}
          >
            {
              Object.keys(schema ?? {}).map(key => {
                return (
                  <MenuItem key={key} value={key}>{key}</MenuItem>
                )
              })
            }
          </Select>
          <TextField
            ss={{
              paddingTop: 10,
            }}
            id="outlined-basic"
            label={t("reference")}
            variant="outlined"
            error={referenceNameError}
            helperText={referenceNameError && t('reference_already_exists')}
            onChange={handleReferenceNameChange}
            value={referenceName}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<AddBoxIcon />}
          variant="contained"
          disabled={selectedType === '' || referenceNameError || !referenceName}
          onClick={handleAddReference}
        >
          {t('add')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}




export default function ChecklistReferenceSchemaDialog({
  open,
  setOpen,
  schema,
  getSchemaData,
}) {

  const [schemaForTable, setSchemaForTable] = useState(null);
  const [openAddReference, setOpenAddReference] = useState(false);

  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  // const handleChange = (event) => {
  //   setSelectedItem(event.target.value);
  // }

  useEffect(() => {
    if (schema) {
      let _schemaForTable = {
        header: [],
        body: [],
        maxLines: 0,
        maxColumns: 0,
        lines: [],
      };
      Object.keys(schema ?? {}).forEach((key) => {
        _schemaForTable.header.push(key);
        _schemaForTable.body.push(schema[key]);
        if (Object.keys(schema[key]).length > _schemaForTable.maxLines) {
          _schemaForTable.maxLines = Object.keys(schema[key]).length;
        }
      });
      _schemaForTable.maxColumns = _schemaForTable.header.length;
      _schemaForTable.lines = [];
      Array(_schemaForTable.maxLines).fill(undefined).forEach((_, index) => {
        _schemaForTable.lines.push(Array(_schemaForTable.maxColumns).fill(undefined));
      });

      _schemaForTable.body.forEach((row, index) => {
        Object.keys(row).forEach((cell, i) => {
          _schemaForTable.lines[i][index] = { [cell]: row[cell], header: _schemaForTable.header[index] };
        })
      })

      setSchemaForTable(_schemaForTable);
    }
  }, [schema]);


  useEffect(() => {
    if (open) {
      getSchemaData();
    }
  }, [open])

  useEffect(() => {
    if (!openAddReference) {
      getSchemaData();
    }
  }, [openAddReference])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={'lg'}
    >
      <DialogTitle
        textAlign={'center'}
      >
        {t('checklist_references_schema')}
        <Tooltip title={t('add_reference')}>
          <IconButton
            onClick={() => setOpenAddReference(true)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 12
            }}
          >
            <AddBoxIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <TableContainer
            sx={{
              maxHeight: 440
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {
                    schemaForTable?.header?.map((key, index) => {
                      return (
                        <TableCell align='center' key={`${key}-${index}`}>
                          {key}
                        </TableCell>
                      )
                    })
                  }
                </TableRow>
              </TableHead>
              <TableBody>

                {
                  schemaForTable?.lines?.map((line, index) => {
                    return (
                      <TableRow key={index}>
                        {
                          line.map((cell, i) => {
                            return (
                              <>
                                {
                                  cell ?
                                    <>
                                      <TableCell key={`${cell}-${i}-${index}`}>
                                        {cell ? Object.keys(cell)[0] : ''}
                                      </TableCell>
                                    </>
                                    :
                                    <>
                                      <TableCell key={`${cell}-${i}-${index}`} />
                                    </>
                                }
                              </>
                            )
                          })
                        }
                      </TableRow>
                    )
                  })
                }
              </TableBody>

            </Table>
          </TableContainer>
        </Paper>
      </DialogContent>
      <AddReferenceDialog
        open={openAddReference}
        setOpen={setOpenAddReference}
        schema={schema}
      />
    </Dialog>
  )
}