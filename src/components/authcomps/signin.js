"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { observer } from "mobx-react-lite";
import AlertDialog from "@/components/common/dialog/dialog";
import local from "@/globals/local";
import AuthField from "@/components/authcomps/components/textfield/authField";
import { useAuth } from "@/components/authcomps/useAuth";
import { ForgetPsw } from "@/components/authcomps/components/navigation/ForgetPsw";
import { ShowSignUp } from "@/components/authcomps/components/navigation/ShowSignUp";

const SignIn = observer(() => {
  const { handleSignInSubmit } = useAuth();

  return (
    <>
      <Box
        component="form"
        noValidate
        onSubmit={handleSignInSubmit}
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
        <AuthField type={"password"} />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {local.ru.caption.AUTH_SIGNIN}
        </Button>
        <Grid direction="column" container spacing={3}>
          <Grid size={{ xs: "grow" }}>
            <ForgetPsw />
          </Grid>
          <Grid size={{ xs: "grow" }}>
            <ShowSignUp />
          </Grid>
        </Grid>
      </Box>
    </>
  );
});

export default SignIn;
