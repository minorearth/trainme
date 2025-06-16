import React, { memo } from "react";
import Animation from "@/components/common/lottieAnimation/Animation.js";

const AnimNode = memo(({ data }) => {
  return <Animation width={"200px"} height={"200px"} name={data.lottie} />;
});
AnimNode.displayName = "AnimNode";
export default AnimNode;
