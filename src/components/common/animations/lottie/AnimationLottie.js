"use client";
import React from "react";
import { Box } from "@mui/material";
import { getLottie } from "./getLottie";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const AnimationLottie = ({ height, width, name, onClick = () => {} }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => onClick()}
    >
      <Lottie
        style={{ height, width }}
        animationData={getLottie(name)}
        loop={true}
        autoPlay={true}
        renderer={"svg"}
      ></Lottie>
    </Box>
  );
};

export default AnimationLottie;
