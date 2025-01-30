import { useLottie } from "lottie-react";
import ok from "@/components/test/congrat/congratulation/lottie/ok.json";
import { useEffect } from "react";
import splashCDStore from "./splashCDStore";

const style = {
  height: 300,
};

const LottieView = ({ action }) => {
  const options = {
    animationData: ok,
    loop: false,
    autoplay: false,
    onComplete: () => {
      splashCDStore.setCloseProgress();
    },
  };
  const { View, play, Lottie, goToAndPlay } = useLottie(options, style);
  useEffect(() => {
    goToAndPlay(0);
  }, [splashCDStore.state]);

  return View;
};

export default LottieView;
