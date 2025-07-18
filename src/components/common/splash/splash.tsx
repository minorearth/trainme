"use client";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";

//stores
import splash from "./store";

//components
import CountdownCircle from "@/components/common/splash/components/CountdownCircle";
import CSSLoader from "@/components/common/animations/css/CSSSplash";
import AnimationLottieGoToPlay from "@/components/common/splash/components/AnimationLottieGoToPlay";
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie";

const Splash = observer(() => {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#121212", zIndex: theme.zIndex.drawer + 1 })}
      open={splash.delayed || splash.shown}
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
          backgroundColor: splash.state.background ? "#121212" : "transparent",
        }}
      ></Box>
      {splash.state.animationtype == "lottie" && (
        <AnimationLottie
          style={{ width: "700px", height: "700px" }}
          name={splash.state.animation}
        />
      )}
      {splash.state.animationtype == "gotoplayLottie" && (
        <AnimationLottieGoToPlay
          style={{ width: "700px", height: "700px" }}
          name={splash.state.animation}
          onCompleteAction={splash.state.onCompleteAction}
        />
      )}

      {splash.state.animationtype == "css" && <CSSLoader />}
      {splash.state.animationtype == "countdown" && <CountdownCircle />}
    </Backdrop>
  );
});

export default Splash;
