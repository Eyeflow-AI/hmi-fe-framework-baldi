import React, { useState } from "react";
import MUITextField from "@mui/material/TextField";

export default function TextField({}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
    setError(false);
  };

  return (
    <MUITextField
      value={value}
      onChange={handleChange}
      error={error}
      helperText={error ? "Please enter a valid value" : ""}
    />
  );
}
