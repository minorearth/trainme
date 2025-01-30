"use client";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import splashCDStore from "./splashCDStore";
import dynamic from "next/dynamic";
import ok from "@/components/test/congrat/congratulation/lottie/ok.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SplashCD = observer(({}) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current?.goToAndPlay(0);
    }
  }, [ref.current, splashCDStore.state]);

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={splashCDStore.state.showSplashCD}
    >
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: splashCDStore.state.background
            ? "black"
            : "transparent",
        }}
      ></Box>
      <Lottie
        lottieRef={ref}
        style={{ height: "400px", width: "400px" }}
        animationData={ok}
        autoPlay={false}
        loop={false}
        onComplete={() => {
          splashCDStore.setCloseProgress();
        }}
      />
    </Backdrop>
  );
});

export default SplashCD;
