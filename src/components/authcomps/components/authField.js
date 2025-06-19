"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import local from "@/globals/local";
import { useState } from "react";
import authForm from "@/components/authcomps/store";
import { Box, Button } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

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
  const [value, setValue] = useState("");
  const [showPsw, hidePsw] = useState(type == "password");

  const handleChange = (e) => {
    setValue(e.target.value);
    authForm.setState(type, { value: e.target.value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
      }}
    >
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

        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: type == "password" && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    hidePsw((state) => !state);
                  }}
                  edge="end"
                >
                  {showPsw ? (
                    <RemoveRedEyeOutlinedIcon />
                  ) : (
                    <VisibilityOffOutlinedIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        margin="normal"
        value={value}
        required
        fullWidth
        id={type}
        label={getProps(type).label}
        name={type}
        autoComplete={getProps(type).auto}
        autoFocus={type == "email" ? true : false}
        type={showPsw ? "password" : null}
        onChange={(e) => handleChange(e)}
        error={authForm.state[type].error}
        helperText={authForm.state[type].helperText}
        color={authForm.state[type].error ? "error" : "primary"}
      />
    </Box>
  );
});

export default AuthField;
