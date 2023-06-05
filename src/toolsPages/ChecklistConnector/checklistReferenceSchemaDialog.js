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
  , FormControl
  , InputLabel
  , MenuItem
  , Select
} from '@mui/material';

// Internal

// Third-party
import { useTranslation } from 'react-i18next';




export default function ChecklistReferenceSchemaDialog({
  open,
  setOpen,
  schema,
  getSchemaData,
}) {

  const [schemaForTable, setSchemaForTable] = useState(null);

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
    </Dialog>
  )
}