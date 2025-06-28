"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AlertDialog from "@/components/common/dialog/dialog";
import local from "@/globals/local";
import { HasAcc } from "@/components/authsteps/authNavigationComps/HasAcc";
import CustomField from "@/components/common/customfield/customField";
import { handleSignUpSubmit } from "@/components/authsteps/layers/services/services";

const SignUp = () => {
  return (
    <Box
      // component="form"
      // onSubmit={authForm.actions.handleSignUpSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
        width: "100%",
      }}
    >
      <AlertDialog />
      <CustomField type={"name"} />
      <CustomField type={"email"} />
      <CustomField type={"password"} />
      <Button
        onClick={(event) => handleSignUpSubmit(event)}
        fullWidth
        variant="contained"
      >
        {local.ru.caption.AUTH_SIGNUP}
      </Button>
      <HasAcc />
    </Box>
  );
};

export default SignUp;
