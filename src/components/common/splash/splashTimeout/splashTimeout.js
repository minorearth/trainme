"use client";
import React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Animation from "../../lottieAnimation/Animation";
import Loader from "../CSSSplash";

const SplashTimeout = ({ action, duration, appState }) => {
  const theme = useTheme();

  useEffect(() => {
    appState &&
      setTimeout(() => {
        action(false);
      }, duration);
  }, [appState]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: theme.palette.background.default,
        paddingLeft: "20px",
      }}
    >
      {/* <Animation height={"400px"} width={"400px"} name={"logo"} /> */}
      <Loader />
    </Box>
  );
};

export default SplashTimeout;
