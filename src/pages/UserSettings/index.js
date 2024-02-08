// React
import React, { useState } from "react";

// Design
import Box from "@mui/material/Box";

// Internal
import PageWrapper from "../../components/PageWrapper";
import Menu from "./menu";
import ChangePassword from "./dialog/ChangePassword";
import API from "../../api";
import authSlice from "../../store/slices/auth";

// Third-party
import { useDispatch } from "react-redux";

const style = {
  mainBox: Object.assign({}, window.app_config.style.box, {
    bgcolor: "background.paper",
    // bgcolor: 'red',
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  }),
};

const UserSettings = () => {
  const [selectedDialog, setSelectedDialog] = useState(null);

  const dispatch = useDispatch();

  const resetPassword = (username, newPassword) => {
    API.put
      .resetPassword({ username, newPassword })
      .then((result) => {})
      .catch(console.log)
      .finally(() => {
        setSelectedDialog(null);
        // dispatch(authSlice.actions.logout());
      });
  };

  return (
    <PageWrapper>
      {({ width, height }) => (
        <Box
          display="flex"
          justifyContent={"center"}
          alignItems={"center"}
          width={width}
          height={height}
          sx={style.mainBox}
        >
          <Menu
            setSelectedDialog={setSelectedDialog}
            selectedDialog={selectedDialog}
          />
          {selectedDialog === "change_password" && (
            <ChangePassword
              open={selectedDialog === "change_password"}
              onClose={() => setSelectedDialog(null)}
              func={resetPassword}
            />
          )}
        </Box>
      )}
    </PageWrapper>
  );
};

export default UserSettings;
