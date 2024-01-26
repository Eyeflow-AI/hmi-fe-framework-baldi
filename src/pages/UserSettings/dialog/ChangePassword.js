// React
import React, { useEffect, useState } from "react";

// Design
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Internal
import { getUserUsername } from "../../../store/slices/auth";

// Third-party
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ChangePassword = ({ open, onClose, func }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);

  const username = useSelector(getUserUsername);

  const handlePasswordUpdate = (value) => {
    // check if password is valid
    if (value.length < 8) {
      setValid(false);
    } else {
      setValid(true);
    }

    setPassword(value);
  };

  useEffect(() => {
    if (open) {
      setPassword("");
      setValid(false);
      setLoading(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby=""
      aria-describedby=""
      // fullWidth
    >
      <DialogTitle>{t("change_password")}</DialogTitle>
      <DialogContent>
        <TextField
          label={t("new_password")}
          variant="outlined"
          value={password}
          onChange={(e) => handlePasswordUpdate(e.target.value)}
          // fullWidth
          sx={{ margin: "1rem" }}
          type="password"
          error={!valid}
          helperText={valid ? "" : t("password_not_valid")}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ margin: "1rem" }}
        >
          {t("cancel")}
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{ margin: "1rem" }}
          disabled={!valid || loading}
          onClick={() => {
            setLoading(true);
            func(username, password);
          }}
        >
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePassword;
