"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";
import AlertDialog from "@/components/common/dialog/dialog";
import local from "@/globals/local";
import { RecallPsw } from "@/components/authcomps/components/navigation/RecalPsw";
import { useAuth } from "@/components/authcomps/useAuth";
import AuthField from "@/components/authcomps/components/textfield/authField";

const PswReset = observer(() => {
  const { handleForgetPswSubmit } = useAuth();

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleForgetPswSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
        width: "100%",
      }}
    >
      <AlertDialog />
      <AuthField type={"email"} />
      <Button type="submit" fullWidth variant="contained">
        {local.ru.caption.AUTH_RESETPSW}
      </Button>
      <RecallPsw />
    </Box>
  );
});

export default PswReset;
