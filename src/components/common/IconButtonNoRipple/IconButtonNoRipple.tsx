// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
"use client";
import React from "react";
import IconButton from "@mui/material/IconButton";

const IconButtonNoRipple = ({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <IconButton
      disableRipple
      disabled={disabled}
      sx={{
        color: "inherit",
        "&:hover": {
          opacity: 0.7,
        },
        "&:active": {
          opacity: 0.9,
        },
      }}
    >
      {children}
    </IconButton>
  );
};

export default IconButtonNoRipple;
