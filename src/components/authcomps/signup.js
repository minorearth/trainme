"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import AlertDialog from "@/components/common/dialog/dialog";
import local from "@/globals/local";
import { HasAcc } from "@/components/authcomps/components/navigation/HasAcc";
import AuthField from "@/components/authcomps/components/authField";
import { useAuth } from "@/components/authcomps/useAuth";

const SignUp = () => {
  const { handleSignUpSubmit } = useAuth();

  return (
    <Box
      component="form"
      onSubmit={handleSignUpSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
        width: "100%",
      }}
    >
      <AlertDialog />
      <FormControl>
        <AuthField type={"name"} />
        <AuthField type={"email"} />
        <AuthField type={"password"} />
      </FormControl>
      <Button type="submit" fullWidth variant="contained">
        {local.ru.caption.AUTH_SIGNUP}
      </Button>
      <HasAcc />
    </Box>
  );
};

export default SignUp;
