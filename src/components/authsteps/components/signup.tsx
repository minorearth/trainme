"use client";

//react stuff
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

//components
import CustomField from "@/components/common/customfield/customField";
import { CustomLink } from "@/components/authsteps/components/customLink";

//globals
import L from "@/globals/local";

//services(local)
import { signUpSubmit } from "@/components/authsteps/layers/services/services";

// stores
import authForm from "@/components/authsteps/layers/store/store";
import { CFT } from "@/components/common/customfield/types";

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
      <CustomField type={CFT.name} />
      <CustomField type={CFT.email} />
      <CustomField type={CFT.password} />
      <Button
        onClick={(event) => signUpSubmit(event)}
        fullWidth
        variant="contained"
      >
        {L.ru.links.AUTH_SIGNUP}
      </Button>
      <CustomLink
        action={() => authForm.showSignIn()}
        title={L.ru.links.AUTH_SIGNIN}
        text={L.ru.links.AUTH_HAVE_ACCOUNT + " "}
      />
    </Box>
  );
};

export default SignUp;
