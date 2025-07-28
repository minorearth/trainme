import React, { memo } from "react";
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie";
import { NodeDataDB } from "tpconst/T";

const AnimNode = memo(({ data }: { data: NodeDataDB }) => {
  return (
    <AnimationLottie
      style={{ width: "200px", height: "200px" }}
      name={data.lottie}
    />
  );
});
AnimNode.displayName = "AnimNode";
export default AnimNode;
