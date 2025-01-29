import React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";
import Logo from "./animation.json";
import Lottie from "lottie-react";

const Splash = ({ action, duration, navState }) => {
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
        backgroundColor: "black",
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
