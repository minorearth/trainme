"use client";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import splashCDStore from "./store";
import dynamic from "next/dynamic";
import { reaction } from "mobx";
import { getLottie } from "@/components/common/lottieAnimation/getLottie";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SplashAction = observer(({ name }) => {
  const ref = useRef();

  useEffect(() => {
    return reaction(
      () => splashCDStore.state.showSplashCD,
      () => {
        if (!splashCDStore.state.showSplashCD) {
          splashCDStore.state.action2();
        }
      }
    );
  }, []);

  useEffect(() => {
    if (ref.current && splashCDStore.state.showSplashCD) {
      ref.current?.goToAndPlay(0);
    }
  }, [splashCDStore.state]);

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
        style={{ height: "700px", width: "700px" }}
        animationData={getLottie(name)}
        autoPlay={false}
        loop={false}
        onComplete={() => {
          splashCDStore.setCloseProgress();
        }}
      />
    </Backdrop>
  );
});

export default SplashAction;
