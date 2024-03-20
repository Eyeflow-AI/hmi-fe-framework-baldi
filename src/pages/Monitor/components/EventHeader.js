// React
import React, { useMemo } from "react";

import Box from "@mui/material/Box";

import LabelBox from "../../../componentsStore/Box/LabelBox";
import accessObjValueWithMongoNotation from "../../../utils/functions/accessObjValueWithMongoNotation";

import { useTranslation } from "react-i18next";
import { dateFormat } from "sdk-fe-eyeflow";

const mainBoxSx = Object.assign({}, window.app_config.style.box, {
  bgcolor: "background.paper",
  display: "flex",
  alignItems: "center",
  gap: 1,
  paddingLeft: 1,
  overflowX: "auto",
  overflowY: "hidden",
  width: "100%",
});

const styleSx = {
  mainBox: mainBoxSx,
  mainBoxDisabled: Object.assign({}, mainBoxSx, { opacity: 0.8 }),
  itemBox: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(133, 133, 133, 0.6)",
    borderRadius: 1,
    height: 56,
    paddingTop: 0.2,
    paddingLeft: 0.8,
    paddingRight: 0.8,
    // paddingBottom: 0.1,
  },
};

export default function EventHeader({ data, config, disabled }) {
  const { t } = useTranslation();

  console.log({ config });

  const { fields } = useMemo(() => {
    return {
      fields: config.fields.map(({ label, field, type, defaultValue }) => {
        let thisData = defaultValue ?? "";
        let value = accessObjValueWithMongoNotation(data, field);
        console.log({ label, value, data });
        if (value) {
          if (type === "date") {
            thisData = dateFormat(new Date(value));
          } else {
            thisData = value;
          }
        }

        return { label: t(label), field, data: thisData };
      }),
    };
  }, [data, config]);

  return (
    <Box
      width={config.width}
      height={config.height}
      sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}
    >
      {Boolean(data) &&
        fields.map(({ data, label }, index) => (
          <LabelBox key={index} title={t(label)} label={data} />
        ))}
    </Box>
  );
}
