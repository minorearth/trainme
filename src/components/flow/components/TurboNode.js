import React, { memo } from "react";
// import { FiCloud } from "react-icons/fi";
import { CiPlay1 } from "react-icons/ci";

import { Handle, Position } from "@xyflow/react";
import FunctionIcon from "./FunctionIcon.js";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import CheckIcon from "@mui/icons-material/Check";

const TurboNode = memo(({ data }) => {
  return (
    <>
      <div className="cloud gradient">
        <div style={{ width: "30px" }}>
          {data.unlocked ? (
            <LockOpenIcon />
          ) : data.completed ? (
            <CheckIcon />
          ) : (
            <LockIcon />
          )}
        </div>
      </div>

      <div className="wrapper gradient" onClick={() => data.action(data.id)}>
        <div className="inner">
          <div className="body">
            <div className="icon">
              <FunctionIcon />
            </div>
            <div>
              <pre>
                <div className="title">{data.title}</div>
              </pre>
              {data.subline && <div className="subline">{data.subline}</div>}
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
