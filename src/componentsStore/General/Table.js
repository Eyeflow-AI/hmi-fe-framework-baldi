import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import jsonToTable from "../../utils/functions/jsonToTable";

const styleSx = {
  mainBoxSx: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "50%",
  },
};

export default function Table({ name, tag, componentsInfo, style, metadata }) {
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "45px",
        }}
      >
        {headers.map((header, index) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: `calc(100% / ${headers.length})`,
              height: "100%",
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
          height: "calc(100%)",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
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
                height: "50px",
              }}
              key={index}
            >
              {row.map((cell, i) => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: `calc(100% / ${headers.length})`,
                    height: "100%",
                  }}
                  key={i}
                >
                  {cell}
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
