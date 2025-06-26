"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import authForm from "@/components/authcomps/store";
import { Box, Button } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { textFieldProps } from "@/components/authcomps/components/textfield/setup";

import txtField from "@/components/authcomps/components/textfield/store";

const PswHideShow = ({ hidePsw, showPsw }) => {
  return (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={() => {
          hidePsw((state) => !state);
        }}
        edge="end"
      >
        {showPsw ? <RemoveRedEyeOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
      </IconButton>
    </InputAdornment>
  );
};

const AuthField = observer(({ type }) => {
  // const [value, setValue] = useState("");
  const [showPsw, hidePsw] = useState(type == "password");

  // const handleChange = (e) => {
  //   setValue(e.target.value);
  //   authForm.setState(type, { value: e.target.value });
  // };

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
              <PswHideShow hidePsw={hidePsw} showPsw={showPsw} />
            ),
          },
        }}
        margin="normal"
        value={txtField.state[type].value}
        required
        fullWidth
        id={type}
        label={textFieldProps[type].label}
        name={type}
        autoComplete={textFieldProps[type].auto}
        autoFocus={type == "email" ? true : false}
        type={showPsw ? "password" : null}
        onChange={(e) => txtField.handleChange2(e.target.value, type)}
        error={txtField.state[type].error}
        helperText={txtField.state[type].helperText}
        color={txtField.state[type].error ? "error" : "primary"}
      />
    </Box>
  );
});

export default AuthField;
