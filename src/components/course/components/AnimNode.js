import React, { memo } from "react";
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie.js";

const AnimNode = memo(({ data }) => {
  return (
    <AnimationLottie width={"200px"} height={"200px"} name={data.lottie} />
  );
});
AnimNode.displayName = "AnimNode";
export default AnimNode;
