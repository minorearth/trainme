// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
"use client";
import React from "react";
import IconButton from "@mui/material/IconButton";

const IconButtonNoRipple = ({ children }) => {
  return (
    <IconButton
      disableRipple
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
