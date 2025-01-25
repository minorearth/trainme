"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "./link";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { resetPswClient } from "@/db/domain/domain";

import AlertDialog from "@/components/common/dialog/dialog";
import alertdialog from "@/store/dialog";
import local from "@/globals/local";
import authenticationForm from "@/store/authentication";

const PswReset = observer(() => {
  const handleForgetPswSubmit = () => {
    resetPswClient(authenticationForm.email);
    alertdialog.showDialog(
      local.ru.msg.alert.PSW_RECOVERY_TITLE,
      local.ru.msg.alert.PSW_RECOVERY_TEXT,
      1,
      () => {
        authenticationForm.showSignIn();
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
        width: "100%",
      }}
    >
      <AlertDialog />
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          handleForgetPswSubmit();
        }}
      >
        {local.ru.caption.AUTH_RESETPSW}
      </Button>
      <Typography sx={{ textAlign: "center" }}>
        {local.ru.text.AUTH_REMEMBER + " "}
        <Link
          action={() => {
            authenticationForm.showSignIn();
          }}
          title={local.ru.caption.AUTH_SIGNIN}
        />
      </Typography>
    </Box>
  );
});

export default PswReset;
