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
import CongratAnimation from "@/components/test/congrat/congratulation/congratAnimation";

import { BsUnlock } from "react-icons/bs";

const TurboNode = memo(({ data }) => {
  return (
    <>
      <div className="cloud gradient">
        <div style={{ width: "30px" }}>
          {data.completed ? (
            <CheckIcon />
          ) : data.unlocked ? (
            <LockOpenIcon />
          ) : (
            <LockIcon />
          )}
        </div>
      </div>

      <div className="wrapper gradient" onClick={() => data.action(data)}>
        <div className="inner">
          <div className="body">
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div className="icon">
                  <FunctionIcon />
                </div>
                <div className="title">{data.title}</div>
              </div>
              {data.subline && <div className="subline">{data.subline}</div>}
              {data.unlockpts && !data.paid && (
                <div className="cost">
                  <BiCoinStack />
                  <p>{data.unlockpts}</p>
                  <GoArrowRight />
                  <BsUnlock />
                </div>
              )}
            </div>
          </div>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </div>
      </div>
    </>
  );
});
TurboNode.displayName = "TurboNode";
export default TurboNode;
