"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import local from "@/globals/local";
import { useState } from "react";
import authForm from "@/store/authentication";
import { useTheme } from "@mui/material/styles";

const getProps = (type) => {
  switch (true) {
    case type == "email":
      return { auto: "email", label: local.ru.caption.AUTH_ENTER_EMAIL };
    case type == "password":
      return {
        auto: "current-password",
        label: local.ru.caption.AUTH_ENTER_PSW,
      };
    case type == "name":
      return {
        auto: "name",
        label: local.ru.caption.AUTH_ENTER_NAME,
      };

    default:
      return {
        auto: null,
        label: "",
      };
  }
};

const AuthField = observer(({ type }) => {
  const theme = useTheme();
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    setValue(e.target.value);
    authForm.setState(type, { value: e.target.value });
  };

  return (
    <TextField
      sx={{
        "&:-webkit-autofill": {
          // WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.default.toString()} inset`,
          WebkitBoxShadow: `0 0 0 100px #fff inset `,
          WebkitTextFillColor: "ffffff",
        },
      }}
      // sx={{
      //   "& :-webkit-autofill": {
      //     WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.default} inset`,
      //     WebkitTextFillColor: "ffffff",
      //   },
      // }}
      margin="normal"
      value={value}
      required
      fullWidth
      id={type}
      label={getProps(type).label}
      name={type}
      autoComplete={getProps(type).auto}
      autoFocus={type == "email" ? true : false}
      type={type == "password" ? type : null}
      onChange={(e) => handleChange(e)}
      error={authForm.state[type].error}
      helperText={authForm.state[type].helperText}
      color={authForm.state[type].error ? "error" : "primary"}

      //   defaultValue={process.env.NEXT_DEFAULT_EMAIL}
      //   defaultValue={process.env.NEXT_DEFAULT_PSW}
    />
  );
});

export default AuthField;
