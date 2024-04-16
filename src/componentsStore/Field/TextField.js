import React, { useState, useEffect } from "react";
import MUITextField from "@mui/material/TextField";

export default function TextField({
  name,
  tag,
  componentsInfo,
  setComponentsInfo,
  metadata,
}) {
  console.log({ TextField: name, tag, componentsInfo });

  const [value, setValue] = useState("");
  const error = false;

  useEffect(() => {
    if (componentsInfo && typeof componentsInfo === "object") {
      const component =
        componentsInfo?.find((item) => item?.tag === tag && item?.name === name)
          ?.output ?? {};
      // console.log({ component });
      setValue(component?.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsInfo]);

  return (
    <MUITextField
      value={value}
      helperText={error ? "Please enter a valid value" : ""}
      label={metadata?.label ?? ""}
    />
  );
}
