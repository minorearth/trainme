"use client";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import splashCD from "./splashCDStore";
import { observer } from "mobx-react-lite";
import splashCDStore from "./splashCDStore";
import dynamic from "next/dynamic";
import LottieView from "./lottieView";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SplashCD = observer(({}) => {
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
      <LottieView action={splashCD.setCloseProgress} />
    </Backdrop>
  );
});

export default SplashCD;
