"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { SignUpUserClient } from "@/db/domain/domain";
import AlertDialog from "@/components/common/dialog";
import dialog from "@/store/dialog";
import local from "@/globals/local";
import authenticationForm from "@/store/authentication";
import Link from "./link";

const SignUp = () => {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [companyError, setCompanyError] = React.useState(false);
  const [companyErrorMessage, setCompanyErrorMessage] = React.useState("");

  const handleRegister = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const company = document.getElementById("company").value;
    const isValid = validateInputs(email, password, name, company);

    if (isValid) {
      const userC = await SignUpUserClient(email, password, name, company);
      dialog.showDialog(
        local.ru.msg.alert.PSW_ACOUNT_CREATED_TITLE,
        local.ru.msg.alert.PSW_ACOUNT_CREATED_TEXT,
        1,
        () => {
          authenticationForm.showSignIn();
        }
      );
    }
  };

  const validateInputs = (email, password, name, company) => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage(local.ru.msg.snack.AUTH_ENTER_VALID_EMAIL);
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage(local.ru.msg.snack.AUTH_ENTER_VALID_PSW);
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage(local.ru.msg.snack.AUTH_ENTER_VALID_NAME);
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!company || company.length < 1) {
      setCompanyError(true);
      setCompanyErrorMessage(local.ru.msg.snack.AUTH_ENTER_VALID_COMPANY);
      isValid = false;
    } else {
      setCompanyError(false);
      setCompanyErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
        <TextField
          autoComplete="name"
          name="name"
          label={local.ru.caption.AUTH_ENTER_NAME}
          defaultValue=""
          required
          fullWidth
          id="name"
          // placeholder="Jon Snow"
          error={nameError}
          helperText={nameErrorMessage}
          color={nameError ? "error" : "primary"}
        />
      </FormControl>
      <FormControl>
        <TextField
          name="company"
          label={local.ru.caption.AUTH_ENTER_COMPANY}
          defaultValue=""
          required
          fullWidth
          id="company"
          // placeholder=""
          error={companyError}
          helperText={companyErrorMessage}
          color={companyError ? "error" : "primary"}
        />
      </FormControl>
      <FormControl>
        <TextField
          required
          fullWidth
          label={local.ru.caption.AUTH_ENTER_EMAIL}
          defaultValue=""
          id="email"
          name="email"
          autoComplete="email"
          variant="outlined"
          error={emailError}
          helperText={emailErrorMessage}
          color={passwordError ? "error" : "primary"}
        />
      </FormControl>
      <FormControl>
        <TextField
          required
          fullWidth
          name="password"
          // placeholder="••••••"
          defaultValue=""
          label={local.ru.caption.AUTH_ENTER_PSW}
          type="password"
          id="password"
          autoComplete="new-password"
          variant="outlined"
          error={passwordError}
          helperText={passwordErrorMessage}
          color={passwordError ? "error" : "primary"}
        />
      </FormControl>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={() => handleRegister()}
      >
        {local.ru.caption.AUTH_SIGNUP}
      </Button>
      <Typography sx={{ textAlign: "center" }}>
        {local.ru.text.AUTH_HAVE_ACCOUNT + " "}
        <Link
          action={() => {
            authenticationForm.showSignIn();
          }}
          title={local.ru.caption.AUTH_SIGNIN}
        />
      </Typography>
    </Box>
  );
};

export default SignUp;
