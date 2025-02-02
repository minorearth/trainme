"use client";
import React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";
import Logo from "./animation.json";
import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Splash = ({ action, duration, navState }) => {
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
      <Lottie
        style={{ height: "700px", width: "700px" }}
        animationData={Logo}
        loop={true}
      ></Lottie>
    </Box>
  );
};

export default Splash;
