"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Box, Button } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { textFieldProps } from "@/components/common/customfield/setup";

import txtField from "@/components/common/customfield/store";
import { CFT, FieldType } from "./types";

import { SxProps, Theme } from "@mui/material/styles";

const PswHideShow = ({
  hidePsw,
  showPsw,
}: {
  //confirm any
  hidePsw: (value: any) => void;
  showPsw: boolean;
}) => {
  return (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={() => {
          hidePsw((state: boolean) => !state);
        }}
        edge="end"
      >
        {showPsw ? <RemoveRedEyeOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
      </IconButton>
    </InputAdornment>
  );
};

const CustomField = observer(
  ({
    type,
    sx,
    onChangeAction = () => {},
  }: {
    type: FieldType;
    sx?: SxProps<Theme>;
    onChangeAction?: (value: string) => void;
  }) => {
    const [showPsw, hidePsw] = useState<boolean>(type == CFT.password);
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
            ...sx,
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
            // inputLabel: { shrink: true },
            input: {
              endAdornment: type == CFT.password && (
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
          autoFocus={type == CFT.email ? true : false}
          type={showPsw ? CFT.password : undefined}
          onChange={(e) => {
            txtField.handleChange2(e.target.value, type);
            onChangeAction(e.target.value);
          }}
          error={txtField.state[type].error}
          helperText={txtField.state[type].helperText}
          // color={txtField.state[type].error ? "error" : "green"}
        />
      </Box>
    );
  }
);

export default CustomField;
