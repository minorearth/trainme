"use client";
import { observer } from "mobx-react-lite";

//react stuff
import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";

//components
import CustomField from "@/components/common/customfield/customField";
import { CustomLink } from "@/components/authsteps/components/customLink";

//globals
import local from "@/globals/local";

//services(local)
import { signInSubmit } from "@/components/authsteps/layers/services/services";

//stores
import authForm from "@/components/authsteps/layers/store/store";

const SignIn = observer(() => {
  const router = useRouter();

  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event) => signInSubmit(event, router)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
        width: "100%",
      }}
    >
      <CustomField type={"email"} />
      <CustomField type={"password"} />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {local.ru.caption.AUTH_SIGNIN}
      </Button>
      <Grid direction="column" container spacing={3}>
        <Grid size={{ xs: "grow" }}>
          <CustomLink
            action={() => authForm.showResetPsw()}
            title={local.ru.text.AUTH_FORGOT}
            text={""}
          />
        </Grid>
        <Grid size={{ xs: "grow" }}>
          <CustomLink
            action={() => authForm.showSignUp()}
            title={local.ru.caption.AUTH_SIGNUP}
            text={local.ru.text.AUTH_HAVE_NOACCOUNT + " "}
          />
        </Grid>
      </Grid>
    </Box>
  );
});

export default SignIn;
