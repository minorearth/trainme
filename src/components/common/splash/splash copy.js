import React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";
import Logo from "./animation.json";
import Lottie from "lottie-react";

const Splash = ({ action, duration }) => {
  useEffect(() => {
    setTimeout(() => {
      action();
    }, duration);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
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
