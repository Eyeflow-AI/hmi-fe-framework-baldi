// React
import React, { useMemo } from "react";

import Box from "@mui/material/Box";

import LabelBox from "../../../hmiComponents/store/Box/LabelBox";
import accessObjValueWithMongoNotation from "../../../utils/functions/accessObjValueWithMongoNotation";

import validateData from "../../../hmiComponents/functions/dataValidation/header";

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

export default function EventHeader({ config, disabled, itemInfo }) {
  // console.log({ config, disabled, itemInfo });
  const { t } = useTranslation();

  const { fields } = useMemo(() => {
    // console.log({ itemInfo, x: typeof itemInfo === "object" });
    if (
      itemInfo &&
      typeof itemInfo === "object" &&
      Object.keys(itemInfo).length > 0
    ) {
      let newData = validateData({
        obj: itemInfo?.find((item) => item.name === config.name)?.output ?? {},
      });
      return {
        fields: config.fields.map(({ label, field, type, defaultValue }) => {
          let thisData = defaultValue ?? "";
          // console.log({ newData, field });
          let value = accessObjValueWithMongoNotation(newData, field);
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
    } else {
      return { fields: [], label: "", data: "" };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, itemInfo]);

  // console.log({ fields });

  return (
    <Box
      width={config.width}
      height={config.height}
      sx={disabled ? styleSx.mainBoxDisabled : styleSx.mainBox}
    >
      {Boolean(
        itemInfo &&
          typeof itemInfo === "object" &&
          Object.keys(itemInfo).length > 0 &&
          itemInfo?.find((item) => item.name === config.name)?.output
      ) &&
        fields.map(({ data, label }, index) => (
          <LabelBox key={index} title={t(label)} label={data} />
        ))}
    </Box>
  );
}
