"use client";
import React from "react";
import { Box } from "@mui/material";
import { useEffect } from "react";
import success from "./lottie/success.json";
import laptop from "./lottie/laptop.json";
import digits from "./lottie/digits.json";
import circle from "./lottie/circle.json";
import condition from "./lottie/condition.json";

// import Lottie from "lottie-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const getLottie = (name) => {
  switch (true) {
    case name == "success":
      return success;
    case name == "laptop":
      return laptop;
    case name == "digits":
      return digits;
    case name == "circle":
      return circle;
    case name == "condition":
      return condition;
    default:
  }

  success;
};

const Animation = ({ height, width, name }) => {
  console.log(height, width, name);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "50%",
        // width: "100%",
      }}
    >
      <Lottie
        style={{ height, width }}
        animationData={getLottie(name)}
        loop={true}
      ></Lottie>
    </Box>
  );
};

export default Animation;
