"use client";
import React from "react";
import { Box } from "@mui/material";
import { getLottie } from "./getLottie";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Animation = ({ height, width, name }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie
        style={{ height, width }}
        animationData={getLottie(name)}
        loop={true}
        autoPlay={false}
        renderer={"svg"}
      ></Lottie>
    </Box>
  );
};

export default Animation;
