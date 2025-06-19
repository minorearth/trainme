"use client";
import React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Loader from "@/components/common/splash/CSSSplash";

const SplashTimeout = ({ action, duration }) => {
  const theme = useTheme();

  useEffect(() => {
    setTimeout(() => {
      action(false);
    }, duration);
  }, []);

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
      <Loader />
    </Box>
  );
};

export default SplashTimeout;
