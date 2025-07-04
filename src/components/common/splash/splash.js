"use client";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie";
import splash from "./store";
import { observer } from "mobx-react-lite";
import CSSLoader from "@/components/common/animations/css/CSSSplash";
import AnimationLottieGoToPlay from "@/components/common/animations/lottie/AnimationLottieGoToPlay";

const Splash = observer(() => {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={!splash.state.timeelapsed || splash.state.showProgress}
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
          backgroundColor: splash.state.background ? "black" : "transparent",
        }}
      ></Box>
      {splash.state.animationtype == "lottie" && (
        <AnimationLottie
          width={"700px"}
          height={"700px"}
          name={splash.state.animation}
        />
      )}
      {splash.state.animationtype == "gotoplayLottie" && (
        <AnimationLottieGoToPlay
          width={"700px"}
          height={"700px"}
          name={splash.state.animation}
          onCompleteAction={splash.state.onCompleteAction}
        />
      )}

      {splash.state.animationtype == "css" && <CSSLoader />}
    </Backdrop>
  );
});

export default Splash;
