import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import jsonToTable from "../../utils/functions/jsonToTable";

const styleSx = {
  mainBoxSx: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
};

export default function Table({ name, tag, componentsInfo, style }) {
  console.log({ Table: name, tag, componentsInfo, style });

  const [error, setError] = useState(false);
  const [_style, _setStyle] = useState({});
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState([]);

  useEffect(() => {
    if (style) {
      let __style = Object.assign({}, styleSx.mainBoxSx, style);
      _setStyle(__style);
    } else {
      _setStyle(styleSx.mainBoxSx);
    }
  }, [style]);

  useEffect(() => {
    if (componentsInfo && typeof componentsInfo === "object") {
      const component =
        componentsInfo?.find((item) => item?.tag === tag && item?.name === name)
          ?.output ?? [];
      const tabled = jsonToTable(component);
      // delete lineStatus from headers
      let headers = tabled.shift();
      headers = headers.filter((header) => header !== "lineStatus");
      const body = tabled;
      console.log({ headers, body });
      setHeaders(headers);
      setBody(body);
    }
  }, [componentsInfo]);

  return (
    <Box
      sx={{
        ..._style,
      }}
    >
      {/* <MUITable sx={{ ..._style }} size="small">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {body.map((row, index) => {
            return (
              <TableRow key={index}>
                {row.map((cell, index) => (
                  <TableCell key={index}>{cell}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </MUITable> */}
      {/* <Box
        sx=
      > */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "45px",
          // border: "5px solid red",
          // position: "relative",
        }}
      >
        {headers.map((header, index) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: `calc(100% / ${headers.length})`,
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
            key={index}
          >
            {header}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          flexGrow: 1,
          // height: "calc(100% - 95px)",
          overflow: "auto",
          // border: "5px solid red",
          // position: "relative",
        }}
      >
        {body.map((row, index) => {
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                width: `calc(100%)`,
                // height: "45px",
                // border: "5px solid yellow",
                // position: "relative",
              }}
              key={index}
            >
              {row.map((cell, index) => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: `calc(100% / ${headers.length})`,
                    // height: "30px",
                    // border: "5px solid blue",
                    // position: "relative",
                  }}
                  key={index}
                >
                  {cell}
                </Box>
              ))}
            </Box>
          );
        })}
        {/* </Box> */}
      </Box>
    </Box>
  );
}

// [
//   [
//       "name",
//       "address.zip",
//       "address.state",
//       "address.street"
//   ],
//   [
//       "Bob",
//       12345,
//       "Euphoria",
//       ""
//   ],
//   [
//       "Jon",
//       "",
//       "Arizona",
//       "1234 Main St."
//   ]
// ]
