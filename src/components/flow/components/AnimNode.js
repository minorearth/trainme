import React, { memo } from "react";
// import { FiCloud } from "react-icons/fi";
import { CiPlay1 } from "react-icons/ci";

import { Handle, Position } from "@xyflow/react";
import FunctionIcon from "./FunctionIcon.js";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import CheckIcon from "@mui/icons-material/Check";
import { IoPricetag } from "react-icons/io5";
import { BiCoinStack } from "react-icons/bi";
import { RiArrowRightLine } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";
import Animation from "@/components/test/congrat/congratulation/congratAnimation";

import { BsUnlock } from "react-icons/bs";

const AnimNode = memo(({ data }) => {
  return <Animation width={"200px"} height={"200px"} name={data.lottie} />;
});
AnimNode.displayName = "TurboNode";
export default AnimNode;
