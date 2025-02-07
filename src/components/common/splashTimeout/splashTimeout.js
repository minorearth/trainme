"use client";
import React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Animation from "../animation/Animation";

const SplashTimeout = ({ action, duration, navState }) => {
  const theme = useTheme();

  useEffect(() => {
    navState &&
      setTimeout(() => {
        action(false);
      }, duration);
  }, [navState]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Animation height={"700px"} width={"700px"} name={"logo"} />
    </Box>
  );
};

export default SplashTimeout;
