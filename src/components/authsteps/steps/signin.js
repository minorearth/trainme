"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { observer } from "mobx-react-lite";
import AlertDialog from "@/components/common/dialog/dialog";
import local from "@/globals/local";
import CustomField from "@/components/common/customfield/customField";
import { ForgetPsw } from "@/components/authsteps/authNavigationComps/ForgetPsw";
import { ShowSignUp } from "@/components/authsteps/authNavigationComps/ShowSignUp";
import { useRouter } from "next/navigation";
import { handleSignInSubmit } from "@/components/authsteps/layers/services/services";

const SignIn = observer(() => {
  const router = useRouter();
  return (
    <>
      <Box
        component="form"
        noValidate
        onSubmit={(e) => handleSignInSubmit(e, router)}
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
        <CustomField type={"password"} />
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
