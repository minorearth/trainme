"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";
import AlertDialog from "@/components/common/dialog/dialog";
import local from "@/globals/local";
import { RecallPsw } from "@/components/authsteps/authNavigationComps/RecalPsw";
import CustomField from "@/components/common/customfield/customField";
import { handleForgetPswSubmit } from "@/components/authsteps/layers/services/services";

const PswReset = observer(() => {
  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event) => handleForgetPswSubmit(event)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
        width: "100%",
      }}
    >
      <AlertDialog />
      <CustomField type={"email"} />
      <Button type="submit" fullWidth variant="contained">
        {local.ru.caption.AUTH_RESETPSW}
      </Button>
      <RecallPsw />
    </Box>
  );
});

export default PswReset;
