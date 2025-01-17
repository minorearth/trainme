"use client";
import React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";
import Animation from "./animation.json";
// import Lottie from "lottie-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const CongratAnimation = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50%",
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
