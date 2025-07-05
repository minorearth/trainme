"use client";

//react stuff
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

//components
import CustomField from "@/components/common/customfield/customField";
import { CustomLink } from "@/components/authsteps/components/customLink";

//globals
import local from "@/globals/local";

//services
import { signUpSubmit } from "@/components/authsteps/layers/services/services";

// stores
import authForm from "@/components/authsteps/layers/store/store";

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
      <CustomField type={"name"} />
      <CustomField type={"email"} />
      <CustomField type={"password"} />
      <Button
        onClick={(event) => signUpSubmit(event)}
        fullWidth
        variant="contained"
      >
        {local.ru.caption.AUTH_SIGNUP}
      </Button>
      <CustomLink
        action={() => authForm.showSignIn()}
        title={local.ru.caption.AUTH_SIGNIN}
        text={local.ru.text.AUTH_HAVE_ACCOUNT + " "}
      />
    </Box>
  );
};

export default SignUp;
