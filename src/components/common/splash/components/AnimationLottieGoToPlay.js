"use client";
import React from "react";
import { Box } from "@mui/material";
import { getLottie } from "../../animations/lottie/getLottie";
import { useEffect, useRef } from "react";
import splash from "@/components/common/splash/store";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const AnimationLottieGoToPlay = ({
  height,
  width,
  name,
  onCompleteAction = () => {},
}) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && splash.state.play == "start") {
      ref.current?.goToAndPlay(0);
    }
  }, [splash.state.play, ref.current]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie
        lottieRef={ref}
        style={{ height, width }}
        animationData={getLottie(name)}
        autoPlay={false}
        loop={false}
        renderer={"svg"}
        onComplete={() => onCompleteAction()}
      ></Lottie>
    </Box>
  );
};

export default AnimationLottieGoToPlay;
