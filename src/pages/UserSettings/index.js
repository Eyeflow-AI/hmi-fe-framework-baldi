// React
import React, { useState } from "react";

// Design
import Box from "@mui/material/Box";

// Internal
import PageWrapper from "../../components/PageWrapper";
import Menu from "./menu";
import ChangePassword from "./dialog/ChangePassword";
import API from "../../api";

// Third-party

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

  const resetPassword = (username, newPassword) => {
    API.put
      .resetPassword({ username, newPassword })
      .then((result) => {})
      .catch(console.log)
      .finally(() => setSelectedDialog(null));
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
