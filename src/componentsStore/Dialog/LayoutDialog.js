// React
import React from "react";

// Design
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Internal
import LayoutConstructor from "../layoutConstructor";

// Third-party
import { useTranslation } from "react-i18next";

export default function LayoutDialog({
  open,
  onClose,
  name,
  data,
  style,
  config,
  components,
  componentsInfo,
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* <DialogTitle id="form-dialog-title">Subscribe</DialogTitle> */}
      <DialogContent>
        <LayoutConstructor config={config} componentsInfo={componentsInfo} />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          padding: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "white",
            // backgroundColor: "white",
            borderColor: "white",
          }}
        >
          {t("cancel")}
        </Button>
        <Button onClick={onClose} color="primary" variant="contained">
          {t("submit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
