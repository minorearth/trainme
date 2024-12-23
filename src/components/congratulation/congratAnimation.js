import React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";
import Animation from "./animation.json";
import Lottie from "lottie-react";

const CongratAnimation = () => {
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
        animationData={Animation}
        loop={true}
      ></Lottie>
    </Box>
  );
};

export default CongratAnimation;
