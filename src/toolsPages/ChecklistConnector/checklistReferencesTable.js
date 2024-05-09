// React
import React, { useState, useEffect } from "react";

// Design
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

// Internal

// Third-party

export default function ChecklistReferencesTable({
  schemaDocument,
  selectedItem,
  referenceToSave,
  setReferenceToSave,
}) {
  const [schemaForTable, setSchemaForTable] = useState(null);

  // const handleChange = (event) => {
  //   setSelectedItem(event.target.value);
  // }

  const buildTable = (reference) => {
    let _schemaForTable = {
      header: [],
      body: [],
      maxLines: 0,
      maxColumns: 0,
      lines: [],
    };
    Object.keys(reference ?? {}).forEach((key) => {
      _schemaForTable.header.push(key);
      _schemaForTable.body.push(reference[key]);
      if (Object.keys(reference[key]).length > _schemaForTable.maxLines) {
        _schemaForTable.maxLines = Object.keys(reference[key]).length;
      }
    });
    _schemaForTable.maxColumns = _schemaForTable.header.length;
    _schemaForTable.lines = [];
    Array(_schemaForTable.maxLines)
      .fill(undefined)
      .forEach((_, index) => {
        _schemaForTable.lines.push(
          Array(_schemaForTable.maxColumns).fill(undefined)
        );
      });

    _schemaForTable.body.forEach((row, index) => {
      Object.keys(row).forEach((cell, i) => {
        _schemaForTable.lines[i][index] = {
          [cell]: row[cell],
          header: _schemaForTable.header[index],
        };
      });
    });

    setSchemaForTable(_schemaForTable);
  };

  const fillReference = (type, variable, value) => {
    let _referenceToSave = { ...referenceToSave };
    _referenceToSave[type][variable] = value;
    setReferenceToSave(_referenceToSave);
    buildTable(_referenceToSave);
  };

  useEffect(() => {
    if (schemaDocument && selectedItem) {
      const defaultSchema = schemaDocument?.default_schema;
      const customSchema = schemaDocument?.custom_schemas?.[selectedItem?._id];
      const selectedReference = selectedItem?.reference ?? {};

      let referenceToUse = {};

      Object.entries(defaultSchema ?? {}).forEach(([key, value]) => {
        if (!Object.keys(referenceToUse).includes(key)) {
          referenceToUse[key] = {};
        }
        Object.keys(value).forEach((cell) => {
          referenceToUse[key][cell] = selectedReference?.[key]?.[cell] ?? "";
        });
      });

      // console.log("schemaDocument", schemaDocument);
      // console.log("customSchema", customSchema);
      setReferenceToSave(referenceToUse);
      buildTable(referenceToUse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaDocument, selectedItem]);

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: "100%",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {schemaForTable?.header?.map((key, index) => {
                return (
                  <TableCell align="center" key={`${key}-${index}`}>
                    {key}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {schemaForTable?.lines?.map((line, index) => {
              return (
                <TableRow key={index}>
                  {line.map((cell, i) => {
                    return (
                      <>
                        {cell ? (
                          <>
                            <TableCell key={`${Object.keys(cell)[0]}-${index}`}>
                              <FormControl fullWidth>
                                <TextField
                                  id="outlined-required"
                                  label={Object.keys(cell)[0]}
                                  value={Object.values(cell)[0]}
                                  onChange={(event) =>
                                    fillReference(
                                      cell.header,
                                      Object.keys(cell)[0],
                                      event.target.value
                                    )
                                  }
                                />
                              </FormControl>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell key={`${i}-${index}`} />
                          </>
                        )}
                      </>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
